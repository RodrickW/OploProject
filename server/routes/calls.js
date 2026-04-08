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

// Ensure supplier_calls table exists
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
`).catch(err => console.error('Failed to create supplier_calls table:', err));

function normalizePhone(phone) {
  if (!phone) return phone;
  const digits = phone.replace(/[\s\-\.\(\)]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) return '+33' + digits.slice(1);
  return digits;
}

async function generateCallScript(item, supplier, quantity, language) {
  const langInstruction = language === 'en'
    ? 'Write the script in professional English.'
    : 'Rédige le script en français professionnel.';

  const prompt = `You are writing a professional voicemail/phone call script for a restaurant group purchasing manager calling their supplier.

Details:
- Supplier company: ${supplier.name}
- Contact person: ${supplier.contact_person || 'the team'}
- Item to order: ${item.name}
- Quantity needed: ${quantity} ${item.unit}
- Current stock: ${item.current_quantity} ${item.unit} (minimum required: ${item.par_level} ${item.unit})
- Category: ${item.category}

${langInstruction}

Write a concise, professional phone call script (3-5 sentences) that:
1. Identifies the caller as from the restaurant group using Oplo.ai ordering system
2. Clearly states what is being ordered and the quantity
3. Requests confirmation/callback
4. Is natural and polite when read aloud by an automated system

Return ONLY the script text, no labels or formatting.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content?.trim() || '';
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

    // Initiate Twilio call
    const client = getTwilioClient();
    const publicUrl = getPublicUrl();
    const twimlUrl = `${publicUrl}/api/calls/twiml/${callRecord.id}`;
    const statusCallbackUrl = `${publicUrl}/api/calls/status-callback`;
    const twilioCall = await client.calls.create({
      to: normalizedPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
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
    res.status(500).json({ error: err.message });
  }
});

// TwiML webhook — Twilio calls this to get the call script
router.get('/twiml/:callId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM supplier_calls WHERE id = $1',
      [req.params.callId]
    );
    if (!result.rows.length) {
      res.type('text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say language="fr-FR">Désolé, une erreur s'est produite.</Say></Response>`);
    }

    const call = result.rows[0];
    const lang = call.language === 'en' ? 'en-GB' : 'fr-FR';
    const voiceGender = call.language === 'en' ? 'Polly.Amy' : 'Polly.Léa';

    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="${lang}" voice="${voiceGender}">${call.call_script}</Say>
  <Pause length="2"/>
  <Say language="${lang}" voice="${voiceGender}">${call.language === 'en'
    ? 'Thank you. This was an automated message from Oplo AI. Goodbye.'
    : 'Merci. Ce message automatique vous a été envoyé par Oplo AI. Au revoir.'}</Say>
</Response>`);

    await pool.query(
      'UPDATE supplier_calls SET status = $1 WHERE id = $2 AND status = $3',
      ['in-progress', call.id, 'initiated']
    );
  } catch (err) {
    console.error('TwiML error:', err);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>An error occurred. Please try again.</Say></Response>`);
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
