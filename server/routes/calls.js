import { Router } from 'express';
import { pool } from '../db.js';
import OpenAI from 'openai';
import twilio from 'twilio';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});


function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error('Twilio credentials not configured');
  return twilio(sid, token);
}

function getPublicUrl() {
  // Production deployment domain (space-separated list, take first)
  if (process.env.REPLIT_DOMAINS) {
    const first = process.env.REPLIT_DOMAINS.split(' ')[0].trim();
    if (first) return `https://${first}`;
  }
  // Development domain
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return process.env.PUBLIC_URL || 'http://localhost:3001';
}

// Ensure supplier_calls table exists and has conversation_history column
pool.query(`
  CREATE TABLE IF NOT EXISTS supplier_calls (
    id SERIAL PRIMARY KEY,
    item_id TEXT,
    supplier_id TEXT,
    item_name VARCHAR(255),
    supplier_name VARCHAR(255),
    supplier_phone VARCHAR(100),
    call_script TEXT,
    twilio_call_sid VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    language VARCHAR(5) DEFAULT 'fr',
    quantity_ordered NUMERIC,
    unit VARCHAR(50),
    duration INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`).then(() =>
  pool.query(`ALTER TABLE supplier_calls ADD COLUMN IF NOT EXISTS conversation_history TEXT DEFAULT '[]'`)
).catch(err => console.error('Failed to setup supplier_calls table:', err));

function normalizePhone(phone) {
  if (!phone) return phone;
  const digits = phone.replace(/[\s\-\.\(\)]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) return '+33' + digits.slice(1);
  return digits;
}

function cleanScript(script) {
  // Remove any bracket placeholders the AI may have generated e.g. [Votre nom]
  return script
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function generateCallScript(item, supplier, quantity, language) {
  const isFr = language !== 'en';
  const groupName = isFr ? 'le groupe Oplo' : 'the Oplo restaurant group';
  const contactGreeting = supplier.contact_person
    ? (isFr ? `Bonjour ${supplier.contact_person},` : `Good day ${supplier.contact_person},`)
    : (isFr ? 'Bonjour,' : 'Good day,');

  const example = isFr
    ? `Exemple: "Bonjour Sophie Martin, c'est le groupe Oplo. Nous souhaitons commander 10 kg de tomates cerises. Merci de confirmer cette commande ou de nous rappeler. Bonne journée."`
    : `Example: "Good day John Smith, this is the Oplo restaurant group. We would like to order 10 kg of cherry tomatoes. Please confirm or call us back. Thank you."`;

  const prompt = `Write a short automated phone order script (3-4 sentences, spoken aloud by text-to-speech).

Caller: ${groupName}
Recipient: ${supplier.contact_person || supplier.name} at ${supplier.name}
Item: ${quantity} ${item.unit} of ${item.name} (${item.category})
Language: ${isFr ? 'French' : 'English'}

${example}

Rules:
- Start with exactly: ${contactGreeting}
- Say the caller is "${groupName}"
- State the item and quantity clearly using the real values above
- Ask them to confirm or call back
- Write in ${isFr ? 'French' : 'English'} only
- NO brackets, NO placeholders, NO template variables — use only real words

Return the spoken script only, nothing else.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250,
  });

  const raw = response.choices[0]?.message?.content?.trim() || '';
  return cleanScript(raw);
}

async function generateConversationReply(call, history, latestSupplierMessage) {
  const isFr = call.language !== 'en';
  const groupName = isFr ? 'le groupe Oplo' : 'the Oplo restaurant group';

  const systemPrompt = `You are an AI phone assistant calling on behalf of ${groupName}, a restaurant group.
You placed an order with ${call.supplier_name} for ${call.quantity_ordered} ${call.unit} of ${call.item_name}.
Your goal: confirm the order professionally and end the call politely.

Guidelines:
- If supplier confirms → thank them, note any delivery date, then end the call (shouldEnd: true)
- If supplier asks for details → provide them clearly (item: ${call.item_name}, qty: ${call.quantity_ordered} ${call.unit})
- If supplier can't fulfill → ask for an alternative date or thank them politely, then end
- If supplier gives a delivery date → acknowledge it and confirm
- Keep replies SHORT — 1-2 sentences max, natural spoken language
- No filler words, no "certainly", no robotic phrases
- Respond ONLY in ${isFr ? 'French' : 'English'}
- After at most 4 exchanges, wrap up and end the call

Return ONLY valid JSON: { "reply": "...", "shouldEnd": true/false }`;

  const historyText = history
    .map(m => `${m.role === 'ai' ? 'Oplo AI' : 'Supplier'}: ${m.text}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Conversation so far:\n${historyText}\n\nSupplier just said: "${latestSupplierMessage}"\n\nRespond as the AI.` },
    ],
    max_tokens: 150,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      reply: cleanScript(parsed.reply || (isFr ? 'Merci. Au revoir.' : 'Thank you. Goodbye.')),
      shouldEnd: !!parsed.shouldEnd,
    };
  } catch {
    return { reply: isFr ? 'Merci. Au revoir.' : 'Thank you. Goodbye.', shouldEnd: true };
  }
}

// List all calls
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM supplier_calls ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initiate a call to a supplier for a low-stock item
router.post('/initiate', async (req, res) => {
  const { item_id, quantity, language = 'fr' } = req.body;

  if (!item_id) return res.status(400).json({ error: 'item_id required' });

  // Check Twilio config
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    return res.status(503).json({
      error: 'Twilio not configured',
      message: 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER must be set'
    });
  }

  let callRecordId = null;
  try {
    // Fetch item + supplier
    const itemRes = await pool.query(
      `SELECT i.*, s.name as supplier_name, s.contact_person, s.phone as supplier_phone, s.email as supplier_email
       FROM inventory_items i
       LEFT JOIN suppliers s ON i.supplier_id = s.id
       WHERE i.id = $1`,
      [item_id]
    );
    if (!itemRes.rows.length) return res.status(404).json({ error: 'Item not found' });

    const item = itemRes.rows[0];
    if (!item.supplier_phone) {
      return res.status(400).json({ error: 'Supplier has no phone number configured' });
    }

    const qty = quantity || Math.max(item.par_level - item.current_quantity, 1);
    const normalizedPhone = normalizePhone(item.supplier_phone);

    // Generate call script with OpenAI
    const script = await generateCallScript(item, {
      name: item.supplier_name,
      contact_person: item.contact_person,
    }, qty, language);

    // Save call record
    const callRes = await pool.query(
      `INSERT INTO supplier_calls
         (item_id, supplier_id, item_name, supplier_name, supplier_phone, call_script, status, language, quantity_ordered, unit)
       VALUES ($1, $2, $3, $4, $5, $6, 'initiating', $7, $8, $9) RETURNING *`,
      [item_id, item.supplier_id, item.name, item.supplier_name, normalizedPhone, script, language, qty, item.unit]
    );
    const callRecord = callRes.rows[0];
    callRecordId = callRecord.id;

    // Initiate Twilio call
    const client = getTwilioClient();
    const baseUrl = getPublicUrl();
    const fromNumber = normalizePhone(process.env.TWILIO_PHONE_NUMBER);
    const twimlUrl = `${baseUrl}/api/calls/twiml/${callRecord.id}`;
    const statusCallbackUrl = `${baseUrl}/api/calls/status-callback`;

    console.error(`[Call] FROM: ${fromNumber} → TO: ${normalizedPhone}`);
    console.error(`[Call] TwiML URL: ${twimlUrl}`);

    const twilioCall = await client.calls.create({
      to: normalizedPhone,
      from: fromNumber,
      url: twimlUrl,
      statusCallback: statusCallbackUrl,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    // Update with Twilio call SID
    await pool.query(
      'UPDATE supplier_calls SET twilio_call_sid = $1, status = $2 WHERE id = $3',
      [twilioCall.sid, 'initiated', callRecord.id]
    );

    res.json({
      ...callRecord,
      twilio_call_sid: twilioCall.sid,
      status: 'initiated',
      script,
    });
  } catch (err) {
    console.error('Call initiation error:', err);
    if (callRecordId) {
      try {
        await pool.query(
          `UPDATE supplier_calls SET status = 'failed', error_message = $1 WHERE id = $2`,
          [err.message, callRecordId]
        );
      } catch (_) {}
    }
    res.status(500).json({ error: err.message });
  }
});

function xmlEscape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSay(text, voice = 'Polly.Amy', lang = 'en-GB') {
  return `<Say voice="${voice}" language="${lang}">${xmlEscape(text)}</Say>`;
}

function buildConversationTwiml(callId, replyText, shouldEnd, baseUrl, noSpeechFallback) {
  const say = buildSay(replyText);
  if (shouldEnd) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${say}
  <Pause length="1"/>
  <Hangup/>
</Response>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${say}
  <Gather input="speech" timeout="4" speechTimeout="auto" action="${baseUrl}/api/calls/conversation/${callId}" method="POST">
  </Gather>
  ${buildSay(noSpeechFallback)}
  <Hangup/>
</Response>`;
}

// TwiML webhook — Twilio calls this to get the call script (handles GET and POST)
router.all('/twiml/:callId', async (req, res) => {
  console.log(`TwiML requested for call ID: ${req.params.callId}`);
  try {
    const result = await pool.query(
      'SELECT * FROM supplier_calls WHERE id = $1',
      [req.params.callId]
    );
    if (!result.rows.length) {
      console.error(`TwiML: no call record found for ID ${req.params.callId}`);
      res.type('text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>Sorry, an error occurred.</Say></Response>`);
    }

    const call = result.rows[0];
    const baseUrl = getPublicUrl();
    const isFr = call.language !== 'en';
    const noSpeechFallback = isFr
      ? 'Nous n\'avons pas reçu de réponse. Merci, au revoir.'
      : 'We did not receive a response. Thank you, goodbye.';

    // Save opening AI message to conversation history
    const openingHistory = JSON.stringify([{ role: 'ai', text: call.call_script }]);
    await pool.query(
      'UPDATE supplier_calls SET status = $1, conversation_history = $2 WHERE id = $3',
      ['in-progress', openingHistory, call.id]
    );

    console.log(`TwiML serving conversational call ${call.id}, lang=${call.language}`);

    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${buildSay(call.call_script)}
  <Gather input="speech" timeout="4" speechTimeout="auto" action="${baseUrl}/api/calls/conversation/${call.id}" method="POST">
  </Gather>
  ${buildSay(noSpeechFallback)}
  <Hangup/>
</Response>`);
  } catch (err) {
    console.error('TwiML error:', err);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>An error occurred. Please try again.</Say></Response>`);
  }
});

// Conversation webhook — called by Twilio after each supplier response
router.post('/conversation/:callId', async (req, res) => {
  const { callId } = req.params;
  const supplierSpeech = req.body.SpeechResult || '';
  console.log(`[Conversation] Call ${callId} — Supplier said: "${supplierSpeech}"`);

  try {
    const result = await pool.query('SELECT * FROM supplier_calls WHERE id = $1', [callId]);
    if (!result.rows.length) {
      res.type('text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
    }

    const call = result.rows[0];
    const baseUrl = getPublicUrl();
    const isFr = call.language !== 'en';
    const history = JSON.parse(call.conversation_history || '[]');

    // If no speech was detected, end politely
    if (!supplierSpeech.trim()) {
      const noReply = isFr
        ? 'Je n\'ai pas entendu de réponse. Merci, bonne journée.'
        : 'I didn\'t catch that. Thank you for your time, goodbye.';
      history.push({ role: 'ai', text: noReply });
      await pool.query('UPDATE supplier_calls SET conversation_history = $1 WHERE id = $2', [JSON.stringify(history), callId]);
      res.type('text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${buildSay(noReply)}
  <Pause length="1"/>
  <Hangup/>
</Response>`);
    }

    // Add supplier message to history
    history.push({ role: 'supplier', text: supplierSpeech });

    // Cap conversation at 5 AI turns
    const aiTurns = history.filter(m => m.role === 'ai').length;
    const forceEnd = aiTurns >= 5;

    const { reply, shouldEnd } = forceEnd
      ? { reply: isFr ? 'Merci pour votre temps. Au revoir.' : 'Thank you for your time. Goodbye.', shouldEnd: true }
      : await generateConversationReply(call, history, supplierSpeech);

    history.push({ role: 'ai', text: reply });

    await pool.query(
      'UPDATE supplier_calls SET conversation_history = $1 WHERE id = $2',
      [JSON.stringify(history), callId]
    );

    const noSpeechFallback = isFr
      ? 'Merci pour votre temps. Au revoir.'
      : 'Thank you for your time. Goodbye.';

    res.type('text/xml');
    res.send(buildConversationTwiml(callId, reply, shouldEnd || forceEnd, baseUrl, noSpeechFallback));
  } catch (err) {
    console.error('Conversation error:', err);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${buildSay('Thank you. Goodbye.')}
  <Hangup/>
</Response>`);
  }
});

// Twilio status callback webhook
router.post('/status-callback', async (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;

  const statusMap = {
    'initiated': 'initiated',
    'ringing': 'ringing',
    'in-progress': 'in-progress',
    'completed': 'completed',
    'failed': 'failed',
    'busy': 'busy',
    'no-answer': 'no-answer',
  };

  try {
    if (CallSid) {
      await pool.query(
        `UPDATE supplier_calls
         SET status = $1, duration = $2, updated_at = NOW()
         WHERE twilio_call_sid = $3`,
        [statusMap[CallStatus] || CallStatus, CallDuration || null, CallSid]
      );
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('Status callback error:', err);
    res.status(500).send('Error');
  }
});

// Get a single call record
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM supplier_calls WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Preview script without making a call
router.post('/preview', async (req, res) => {
  const { item_id, quantity, language = 'fr' } = req.body;
  if (!item_id) return res.status(400).json({ error: 'item_id required' });

  try {
    const itemRes = await pool.query(
      `SELECT i.*, s.name as supplier_name, s.contact_person, s.phone as supplier_phone
       FROM inventory_items i LEFT JOIN suppliers s ON i.supplier_id = s.id
       WHERE i.id = $1`,
      [item_id]
    );
    if (!itemRes.rows.length) return res.status(404).json({ error: 'Item not found' });
    const item = itemRes.rows[0];
    const qty = quantity || Math.max(item.par_level - item.current_quantity, 1);
    const script = await generateCallScript(item, {
      name: item.supplier_name,
      contact_person: item.contact_person,
    }, qty, language);
    res.json({ script, quantity: qty, item, language });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
