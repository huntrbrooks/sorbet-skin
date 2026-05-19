export type Product = {
  id: string;
  name: string;
  type: string;
  category: string;
  shade: string;
  scent: string;
  price: number;
  finish: string;
  developmentTime: string;
  colorTheme: string;
  themeHex: string;
  asset: string;
  claims: string[];
  heroIngredients: string[];
  copy: string;
  howToUse: string[];
  ingredients: string[];
  rating: number;
};

export type Service = {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  duration: string;
  bestFor: string;
  developmentTime: string;
  description: string;
};

export type ServiceAddon = {
  name: string;
  price: string;
  copy: string;
};

export type PackageItem = {
  id: string;
  name: string;
  includes: string;
  price: number;
  badge?: string;
};

export type BridalPackage = {
  name: string;
  includes: string;
  price: string;
};

export type Review = {
  name: string;
  serviceProduct: string;
  skinTone: string;
  eventType: string;
  text: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type GiftOption = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  key: string;
  kind: 'product' | 'package' | 'gift' | 'routine';
  name: string;
  price: number;
  quantity: number;
  meta?: string;
  accent?: string;
};

export type QuizAnswerMap = Record<string, string>;
