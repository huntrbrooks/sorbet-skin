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
  claims: string[];
  heroIngredients: string[];
  copy: string;
  rating: number;
};

export type CartItem = {
  key: string;
  productId: string;
  quantity: number;
  bundleName?: string;
  discountRate?: number;
};

export type QuizAnswerMap = Record<string, string>;
