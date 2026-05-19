export type CatalogItem = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  accent: string;
  stripePriceIdEnv?: string;
};

export const catalog: CatalogItem[] = [
  { id: 'peach-glaze', name: 'Peach Glaze', type: 'Whipped Self Tan Mousse', price: 29, image: '/assets/product-peach-glaze.svg', accent: '#FF9FB8', stripePriceIdEnv: 'STRIPE_PRICE_PEACH_GLAZE' },
  { id: 'caramel-cloud', name: 'Caramel Cloud', type: 'Whipped Self Tan Mousse', price: 31, image: '/assets/product-caramel-cloud.svg', accent: '#D88955', stripePriceIdEnv: 'STRIPE_PRICE_CARAMEL_CLOUD' },
  { id: 'cocoa-drip', name: 'Cocoa Drip', type: 'Express Tan Foam', price: 34, image: '/assets/product-cocoa-drip.svg', accent: '#8B5A3C', stripePriceIdEnv: 'STRIPE_PRICE_COCOA_DRIP' },
  { id: 'vanilla-veil', name: 'Vanilla Veil', type: 'Gradual Glow Body Whip', price: 27, image: '/assets/product-vanilla-veil.svg', accent: '#F8D66D', stripePriceIdEnv: 'STRIPE_PRICE_VANILLA_VEIL' },
  { id: 'honey-dew-drops', name: 'Honey Dew Drops', type: 'Face Tan Drops', price: 25, image: '/assets/product-honey-dew-drops.svg', accent: '#F3B64D', stripePriceIdEnv: 'STRIPE_PRICE_HONEY_DEW_DROPS' },
  { id: 'champagne-blur', name: 'Champagne Blur', type: 'Bronzing Body Blur', price: 32, image: '/assets/product-champagne-blur.svg', accent: '#E7A84E', stripePriceIdEnv: 'STRIPE_PRICE_CHAMPAGNE_BLUR' },
  { id: 'coconut-melt', name: 'Coconut Melt', type: 'Tan Eraser Foam', price: 24, image: '/assets/product-coconut-melt.svg', accent: '#9BE7D7', stripePriceIdEnv: 'STRIPE_PRICE_COCONUT_MELT' },
  { id: 'velvet-mitt', name: 'Velvet Mitt', type: 'Application Mitt', price: 16, image: '/assets/product-velvet-mitt.svg', accent: '#B8A7FF', stripePriceIdEnv: 'STRIPE_PRICE_VELVET_MITT' },
  { id: 'single-glow', name: 'Single Glow', type: '1 studio spray tan', price: 55, image: '/assets/generated/sorbet-bridal-service.png', accent: '#FF9FB8' },
  { id: 'glow-trio', name: 'Glow Trio', type: '3 studio spray tans', price: 145, image: '/assets/generated/sorbet-bridal-service.png', accent: '#F3B64D' },
  { id: 'glow-five', name: 'Glow Five', type: '5 studio spray tans', price: 240, image: '/assets/generated/sorbet-bridal-service.png', accent: '#9BE7D7' },
  { id: 'glow-ten', name: 'Glow Ten', type: '10 studio spray tans', price: 460, image: '/assets/generated/sorbet-bridal-service.png', accent: '#B8A7FF' },
  { id: 'gift-50', name: '$50 Glow Gift', type: 'Gift certificate', price: 50, image: '/assets/generated/sorbet-social-tiles.png', accent: '#FF9FB8' },
  { id: 'gift-100', name: '$100 Glow Gift', type: 'Gift certificate', price: 100, image: '/assets/generated/sorbet-social-tiles.png', accent: '#F3B64D' },
  { id: 'gift-bridal', name: 'Bridal Glow Gift', type: 'Gift certificate', price: 120, image: '/assets/generated/sorbet-social-tiles.png', accent: '#B8A7FF' },
  { id: 'gift-custom', name: 'Custom Glow Gift', type: 'Gift certificate', price: 75, image: '/assets/generated/sorbet-social-tiles.png', accent: '#9BE7D7' },
];

export const catalogById = new Map(catalog.map((item) => [item.id, item]));
