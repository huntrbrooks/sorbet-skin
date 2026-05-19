import Stripe from 'stripe';
import { requireEnv } from './http.js';

export function getStripe() {
  return new Stripe(requireEnv('STRIPE_SECRET_KEY'));
}
