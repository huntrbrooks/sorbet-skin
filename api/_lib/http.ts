import type { VercelRequest, VercelResponse } from '@vercel/node';

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.PUBLIC_SITE_URL;

  if (origin && (!allowedOrigin || origin === allowedOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Stripe-Signature');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

export function rejectMethod(req: VercelRequest, res: VercelResponse, method = 'POST') {
  if (req.method !== method) {
    res.setHeader('Allow', method);
    res.status(405).json({ error: `Method ${req.method} is not allowed.` });
    return true;
  }

  return false;
}

export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function parseString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

export function readRawBody(req: VercelRequest) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer | string) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
