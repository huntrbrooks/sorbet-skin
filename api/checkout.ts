import type { VercelRequest, VercelResponse } from '@vercel/node';
import { catalogById } from './_lib/catalog';
import { applyCors, parseString, rejectMethod, requireEnv } from './_lib/http';
import { getStripe } from './_lib/stripe';
import { getSupabaseAdmin } from './_lib/supabase';

type CheckoutLine = {
  id?: unknown;
  quantity?: unknown;
  meta?: unknown;
  amount?: unknown;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res) || rejectMethod(req, res)) return;

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const lines = Array.isArray(body.items) ? (body.items as CheckoutLine[]) : [];
    const email = parseString(body.email);

    if (lines.length === 0) {
      res.status(400).json({ error: 'Your cart is empty.' });
      return;
    }

    const stripe = getStripe();
    const siteUrl = requireEnv('PUBLIC_SITE_URL').replace(/\/$/, '');
    const checkoutItems = lines.map((line) => {
      const id = parseString(line.id);
      const quantity = Math.max(1, Math.min(20, Number(line.quantity) || 1));
      const item = catalogById.get(id);

      if (!item) {
        throw new Error(`Unknown cart item: ${id}`);
      }

      const customGiftAmount = id === 'gift-custom' ? Math.max(25, Math.min(500, Number(line.amount) || item.price)) : item.price;
      const configuredPriceId = item.stripePriceIdEnv ? process.env[item.stripePriceIdEnv] : undefined;

      if (configuredPriceId && id !== 'gift-custom') {
        return {
          price: configuredPriceId,
          quantity,
        };
      }

      return {
        quantity,
        price_data: {
          currency: 'aud',
          unit_amount: Math.round(customGiftAmount * 100),
          product_data: {
            name: item.name,
            description: item.type,
            images: [`${siteUrl}${item.image}`],
            metadata: { catalogId: item.id },
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: checkoutItems,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['AU', 'NZ', 'US', 'GB', 'IE'],
      },
      metadata: {
        source: 'sorbet-skin-web',
        cart: JSON.stringify(lines.map((line) => ({ id: parseString(line.id), quantity: Math.max(1, Number(line.quantity) || 1), meta: parseString(line.meta), amount: Number(line.amount) || undefined })).slice(0, 40)),
      },
      success_url: `${siteUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
    });

    const supabase = getSupabaseAdmin();
    await supabase.from('orders').insert({
      stripe_session_id: session.id,
      status: 'created',
      email: email || null,
      cart: lines,
      amount_total: session.amount_total,
      currency: session.currency,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to start checkout.';
    res.status(message.includes('Unknown cart item') ? 400 : 500).json({ error: message });
  }
}
