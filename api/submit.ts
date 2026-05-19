import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, parseString, rejectMethod } from './_lib/http';
import { getSupabaseAdmin } from './_lib/supabase';

const allowedTypes = new Set([
  'booking',
  'contact',
  'newsletter',
  'bridal',
  'competition',
  'mobile',
  'gift',
]);

function sanitizePayload(payload: unknown) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>)
      .slice(0, 40)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim().slice(0, 2000) : value]),
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res) || rejectMethod(req, res)) return;

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const type = parseString(body.type);
    const payload = sanitizePayload(body.payload);

    if (!allowedTypes.has(type)) {
      res.status(400).json({ error: 'Unknown submission type.' });
      return;
    }

    const email = parseString((payload as { email?: unknown }).email);
    const name = parseString((payload as { name?: unknown }).name);

    if ((type === 'booking' || type === 'contact' || type === 'bridal' || type === 'competition') && !email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('submissions').insert({
      type,
      email: email || null,
      name: name || null,
      payload,
      status: 'new',
    });

    if (error) {
      throw error;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save submission.';
    res.status(500).json({ error: message });
  }
}
