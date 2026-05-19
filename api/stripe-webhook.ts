import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readRawBody, requireEnv } from './_lib/http.js';
import { getStripe } from './_lib/stripe.js';
import { getSupabaseAdmin } from './_lib/supabase.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: `Method ${req.method} is not allowed.` });
    return;
  }

  try {
    const stripe = getStripe();
    const signature = req.headers['stripe-signature'];

    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: 'Missing Stripe signature.' });
      return;
    }

    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, requireEnv('STRIPE_WEBHOOK_SECRET'));
    const supabase = getSupabaseAdmin();

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      await supabase.from('orders').upsert(
        {
          stripe_session_id: session.id,
          status: 'paid',
          email: session.customer_details?.email ?? session.customer_email ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
          paid_at: new Date().toISOString(),
          metadata: session.metadata ?? {},
        },
        { onConflict: 'stripe_session_id' },
      );
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      await supabase
        .from('orders')
        .update({ status: event.type === 'checkout.session.expired' ? 'expired' : 'failed', metadata: session.metadata ?? {} })
        .eq('stripe_session_id', session.id);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handling failed.';
    res.status(400).json({ error: message });
  }
}
