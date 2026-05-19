import Stripe from 'stripe';
import { requireEnv } from './http';

export function getStripe() {
  return new Stripe(requireEnv('STRIPE_SECRET_KEY'));
}
