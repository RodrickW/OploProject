import { Router } from 'express';
import { pool } from '../db.js';
import OpenAI from 'openai';
import Retell from 'retell-sdk';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

function getRetellClient() {
  if (!process.env.RETELL_API_KEY) throw new Error('RETELL_API_KEY not configured');
  return new Retell({ apiKey: process.env.RETELL_API_KEY });
}

function getPublicUrl() {
  if (process.env.REPLIT_DOMAINS) {
    const first = process.env.REPLIT_DOMAINS.split(' ')[0].trim();
    if (first) return `https://${first}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return process.env.PUBLIC_URL || 'http://localhost:3001';
}

// Ensure supplier_calls table exists with all required columns
pool.query(`
  CREATE TABLE IF NOT EXISTS supplier_calls (
    id SERIAL PRIMARY KEY,
    item_id TEXT,
    supplier_id TEXT,
    item_name VARCHAR(255),
    supplier_name VARCHAR(255),
    supplier_phone VARCHAR(100),
    call_script TEXT,
    retell_call_id TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    language VARCHAR(5) DEFAULT 'fr',
    quantity_ordered NUMERIC,
    unit VARCHAR(50),
    duration INTEGER,
    error_message TEXT,
    conversation_history TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`).then(() =>
  pool.query(`ALTER TABLE supplier_calls ADD COLUMN IF NOT EXISTS retell_call_id TEXT`)
).then(() =>
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
  return script
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Generate a preview script (shown in the UI before the call — Retell handles the real conversation)
async function generateCallScript(item, supplier, quantity, language) {
  const isFr = language !== 'en';
  const groupName = isFr ? 'le groupe Oplo' : 'the Oplo restaurant group';
  const contactGreeting = supplier.contact_person
    ? (isFr ? `Bonjour ${supplier.contact_person},` : `Good day ${supplier.contact_person},`)
    : (isFr ? 'Bonjour,' : 'Good day,');

  const example = isFr
    ? `Exemple: "Bonjour Sophie Martin, c'est le groupe Oplo. Nous souhaitons commander 10 kg de tomates cerises. Merci de confirmer cette commande ou de nous rappeler. Bonne journée."`
    : `Example: "Good day John Smith, this is the Oplo restaurant group. We would like to order 10 kg of cherry tomatoes. Please confirm or call us back. Thank you."`;

  const prompt = `Write a short phone order opening script (2-3 sentences, spoken aloud).

Caller: ${groupName}
Recipient: ${supplier.contact_person || supplier.name} at ${supplier.name}
Item: ${quantity} ${item.unit} of ${item.name} (${item.category})
Language: ${isFr ? 'French' : 'English'}

${example}

Rules:
- Start with exactly: ${contactGreeting}
- Say the caller is "${groupName}"
- State the item and quantity clearly
- NO brackets, NO placeholders — use only real words
- Write in ${isFr ? 'French' : 'English'} only

Return the spoken script only, nothing else.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  });

  const raw = response.choices[0]?.message?.content?.trim() || '';
  return cleanScript(raw);
}

// Parse Retell transcript_object into our conversation history format
function parseTranscript(transcriptObject) {
  if (!Array.isArray(transcriptObject)) return [];
  return transcriptObject.map(msg => ({
    role: msg.role === 'agent' ? 'ai' : 'supplier',
    text: msg.content || '',
  })).filter(m => m.text.trim());
}

// Map Retell call status to our internal status
function mapRetellStatus(retellStatus) {
  const map = {
    registered: 'initiated',
    ongoing: 'in-progress',
    ended: 'completed',
    error: 'failed',
  };
  return map[retellStatus] || retellStatus;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

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

// Initiate a conversational call to a supplier via Retell AI
router.post('/initiate', async (req, res) => {
  const { item_id, quantity, language = 'fr' } = req.body;

  if (!item_id) return res.status(400).json({ error: 'item_id required' });

  if (!process.env.RETELL_API_KEY || !process.env.RETELL_AGENT_ID || !process.env.RETELL_PHONE_NUMBER) {
    return res.status(503).json({
      error: 'Retell not configured',
      message: 'RETELL_API_KEY, RETELL_AGENT_ID and RETELL_PHONE_NUMBER must be set',
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

    const qty = quantity || Math.max((item.par_level || 0) - (item.current_quantity || 0), 1);
    const normalizedPhone = normalizePhone(item.supplier_phone);
    const fromNumber = normalizePhone(process.env.RETELL_PHONE_NUMBER);

    // Generate preview script (shown in UI — the AI agent handles the real conversation)
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

    // Initiate call via Retell AI
    const retell = getRetellClient();
    const retellCall = await retell.call.createPhoneCall({
      from_number: fromNumber,
      to_number: normalizedPhone,
      agent_id: process.env.RETELL_AGENT_ID,
      retell_llm_dynamic_variables: {
        supplier_name: item.supplier_name || '',
        contact_person: item.contact_person || '',
        item_name: item.name || '',
        quantity: String(qty),
        unit: item.unit || '',
        language: language === 'en' ? 'English' : 'French',
      },
      metadata: { call_record_id: String(callRecord.id) },
    });

    console.log(`[Retell] Call created: ${retellCall.call_id} → ${normalizedPhone}`);

    // Update record with Retell call ID
    await pool.query(
      'UPDATE supplier_calls SET retell_call_id = $1, status = $2 WHERE id = $3',
      [retellCall.call_id, 'initiated', callRecord.id]
    );

    res.json({
      ...callRecord,
      retell_call_id: retellCall.call_id,
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

// Retell webhook — receives call events (call_started, call_ended, call_analyzed)
router.post('/retell-webhook', async (req, res) => {
  const { event, data } = req.body;
  console.log(`[Retell Webhook] event=${event} call_id=${data?.call_id}`);

  try {
    if (!data?.call_id) return res.status(200).send('OK');

    // Find our DB record by retell_call_id or metadata
    const callRecordId = data.metadata?.call_record_id;
    let dbResult;

    if (callRecordId) {
      dbResult = await pool.query('SELECT id FROM supplier_calls WHERE id = $1', [callRecordId]);
    }
    if (!dbResult?.rows?.length) {
      dbResult = await pool.query('SELECT id FROM supplier_calls WHERE retell_call_id = $1', [data.call_id]);
    }
    if (!dbResult?.rows?.length) {
      console.warn(`[Retell Webhook] No DB record found for call_id=${data.call_id}`);
      return res.status(200).send('OK');
    }

    const recordId = dbResult.rows[0].id;

    if (event === 'call_started') {
      await pool.query(
        'UPDATE supplier_calls SET status = $1, updated_at = NOW() WHERE id = $2',
        ['in-progress', recordId]
      );
    }

    if (event === 'call_ended' || event === 'call_analyzed') {
      const status = mapRetellStatus(data.call_status);
      const durationSec = data.duration_ms ? Math.round(data.duration_ms / 1000) : null;
      const history = parseTranscript(data.transcript_object);

      await pool.query(
        `UPDATE supplier_calls
         SET status = $1, duration = $2, conversation_history = $3, retell_call_id = $4, updated_at = NOW()
         WHERE id = $5`,
        [status, durationSec, JSON.stringify(history), data.call_id, recordId]
      );

      console.log(`[Retell Webhook] Call ${recordId} ended: status=${status}, duration=${durationSec}s, turns=${history.length}`);
    }
  } catch (err) {
    console.error('[Retell Webhook] Error:', err);
  }

  res.status(200).send('OK');
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
    const qty = quantity || Math.max((item.par_level || 0) - (item.current_quantity || 0), 1);
    const script = await generateCallScript(item, {
      name: item.supplier_name,
      contact_person: item.contact_person,
    }, qty, language);
    res.json({ script, quantity: qty, item, language });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export default router;
