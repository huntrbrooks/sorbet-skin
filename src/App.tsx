import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Droplets,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  SprayCan,
  Star,
  Sun,
  Trash2,
  WandSparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { productMap, products } from './data/products';
import type { CartItem, Product, QuizAnswerMap } from './types';

const cartStorageKey = 'sorbet-skin-cart-v1';

const navLinks = [
  ['Shop', 'shop'],
  ['Glow Quiz', 'quiz'],
  ['Bundle Builder', 'bundles'],
  ['Routine', 'routine'],
  ['Pro Spray', 'pro'],
  ['Ingredients', 'ingredients'],
  ['Reviews', 'reviews'],
  ['FAQ', 'faq'],
];

const rotatingMessages = [
  'Transfer-resistant once developed, rinsed, and dry.',
  'Self-tan is not SPF. Wear sunscreen daily.',
  'Foaming body tan, gradual glow, and tan-extending bodycare.',
];

const shadeFilters = ['Light to Medium', 'Medium to Dark', 'Dark', 'Buildable', 'Customisable', 'Instant Bronze', 'Prep', 'Tool', 'Glow Enhancer'];
const typeFilters = ['Foaming Body Tan', 'Gradual Tanning Moisturiser', 'Face Drops', 'Instant Body Blur', 'Tan Extender', 'Prep Product', 'Tool', 'Pro Spray'];
const claimFilters = ['Vegan', 'Cruelty-free', 'No fake tan smell', 'Streak-free', 'Transfer-resistant', 'Foaming formula', 'Gradual glow', 'Fragrance-free', 'Professional'];
const developmentFilters = ['Instant', '1 to 3 hours', '2 to 6 hours', '5 minutes', '6 to 8 hours', 'Overnight', 'Daily build'];
const scentFilters = ['Peach Sorbet', 'Salted Caramel', 'Cocoa Vanilla', 'Vanilla Cream', 'Fragrance-free', 'Toasted Coconut', 'Coconut Milk', 'Honey Coconut', 'Low-odour Coconut', 'None'];

const ingredientInfo: Record<string, string> = {
  DHA: "The sunless tanning active that reacts with the skin's surface to create a bronzed look.",
  'Aloe Vera': 'Helps skin feel soft, calm, and hydrated.',
  'Hyaluronic Acid': 'Helps skin feel plump and hydrated.',
  'Kakadu Plum': 'A vitamin C-rich botanical hero ingredient.',
  'Green Tea': 'A botanical antioxidant used in skin-loving formulas.',
  'Coconut Water': 'A refreshing hydration hero for soft-feeling skin.',
  'Vitamin E': 'Helps condition skin and support a smooth bodycare feel.',
  'Jojoba Oil': 'A lightweight oil that helps skin feel soft and conditioned.',
  Squalane: 'A silky emollient that gives body oil a smooth, non-heavy finish.',
  'Shea Butter': 'A rich moisturising butter used in bodycare for softness.',
  'Fruit Enzymes': 'Used in prep formulas to help refresh the feel of skin.',
};

const reviews = [
  {
    name: 'Mia',
    skinTone: 'Fair',
    product: 'Peach Glaze',
    text: 'Finally, a tan that does not smell like old biscuits. Peach Glaze gave me a soft golden colour and blended so easily.',
  },
  {
    name: 'Tahlia',
    skinTone: 'Olive',
    product: 'Caramel Cloud',
    text: 'Warm bronze without going orange. The Velvet Mitt made it basically foolproof.',
  },
  {
    name: 'Jade',
    skinTone: 'Medium',
    product: 'Honey Dew Oil',
    text: 'This made my tan fade way more evenly. Glossy but not greasy.',
  },
  {
    name: 'Sienna',
    skinTone: 'Light',
    product: 'Vanilla Veil',
    text: 'I use it like moisturiser and wake up looking healthier. Perfect daily glow product.',
  },
  {
    name: 'Chloe',
    skinTone: 'Deep',
    product: 'Champagne Blur',
    text: 'Instant glow for events. My legs looked smooth under lights and it dried down nicely.',
  },
  {
    name: 'Ava',
    skinTone: 'Medium',
    product: 'Cocoa Drip',
    text: 'Deep colour fast, but still natural. No harsh fake tan smell, which sold me.',
  },
];

const quizQuestions = [
  { id: 'tone', label: 'What is your natural skin tone?', options: ['Fair', 'Light', 'Medium', 'Olive', 'Deep'] },
  { id: 'result', label: 'What result do you want?', options: ['Subtle glow', 'Golden bronze', 'Deep bronze', 'Instant event glow', 'Daily maintenance', 'Professional spray result'] },
  { id: 'timing', label: 'When do you need the tan?', options: ['Tonight', 'Tomorrow', 'This week', 'Daily maintenance', 'Salon service'] },
  { id: 'skin', label: 'What is your skin vibe?', options: ['Dry', 'Sensitive', 'Normal', 'Oily'] },
  { id: 'scent', label: 'What scent do you prefer?', options: ['Fruity', 'Gourmand', 'Coconut', 'Fragrance-free', 'Low-odour professional'] },
  { id: 'priority', label: 'What matters most?', options: ['Vegan', 'Cruelty-free', 'No fake tan smell', 'Streak-free', 'Transfer-resistant', 'Natural-origin ingredients'] },
];

const presetBundles = [
  { name: 'Starter Glow', ids: ['peach-glaze', 'velvet-mitt', 'honey-dew-oil'] },
  { name: 'Deep Bronze', ids: ['cocoa-drip', 'velvet-mitt', 'honey-dew-oil'] },
  { name: 'Daily Glow', ids: ['vanilla-veil', 'honey-dew-drops', 'honey-dew-oil'] },
  { name: 'Event Glow', ids: ['champagne-blur', 'honey-dew-drops', 'honey-dew-oil'] },
  { name: 'Clean Girl Prep', ids: ['coconut-melt', 'peach-glaze', 'velvet-mitt'] },
  { name: 'Salon Pro', ids: ['sorbet-pro-concentrate', 'coconut-melt', 'honey-dew-oil'] },
];

const routineSteps = [
  {
    title: 'Prep',
    productIds: ['coconut-melt'],
    copy: 'Melt away old tan so your next glow applies evenly.',
    time: '5 minutes',
    tip: 'Focus on elbows, knees, ankles, and any patchy areas before your fresh glow.',
  },
  {
    title: 'Apply',
    productIds: ['peach-glaze', 'caramel-cloud', 'cocoa-drip'],
    copy: 'Use long sweeping motions with Velvet Mitt for a streak-free foaming body tan.',
    time: '10 minutes',
    tip: 'Start at the ankles and work upward so you can blend before the foam settles.',
  },
  {
    title: 'Face',
    productIds: ['honey-dew-drops'],
    copy: 'Mix with moisturiser for a custom face glow.',
    time: '1 minute',
    tip: 'Blend lightly around the hairline and wash hands after application.',
  },
  {
    title: 'Maintain',
    productIds: ['vanilla-veil'],
    copy: 'Use the gradual tanning moisturiser to build soft colour between full tan days.',
    time: 'Daily',
    tip: 'Apply to dry skin in thin layers for a softly buildable finish.',
  },
  {
    title: 'Extend',
    productIds: ['honey-dew-oil'],
    copy: 'Pair with your tan to keep skin hydrated and help your glow fade evenly.',
    time: 'Instant hydration',
    tip: 'Press onto shins, shoulders, and collarbones for a glossy hydrated finish.',
  },
];

const faqs = [
  ['Is Sorbet Skin cruelty-free?', 'Yes, Sorbet Skin is positioned as cruelty-free and never tested on animals. Official certification should be obtained before launch.'],
  ['Is Sorbet Skin vegan?', 'Yes, the range is designed to be vegan with no animal-derived ingredients.'],
  ['Does it smell like fake tan?', 'Sorbet Skin is positioned around no fake tan smell, using playful dessert-inspired scents and low-odour tanning technology.'],
  ['Is it transferproof?', 'Sorbet Skin is transfer-resistant once fully developed, rinsed, and dry. Avoid promising zero transfer in every situation.'],
  ['Is it streak-free?', 'The foaming body tan range is designed for smooth, streak-free blending, especially when used with the Velvet Mitt.'],
  ['Is it all natural?', 'Sorbet Skin products feature naturally derived hero ingredients. Final all natural claims require verified formulation review.'],
  ['Does self-tan protect me from the sun?', 'No. Self-tan does not contain SPF and does not protect against UV exposure. Wear SPF daily.'],
  ['How long does the tan last?', 'Usually 5 to 7 days depending on prep, skin type, application, and moisturising.'],
  ['How do I make my tan last longer?', 'Use Honey Dew Oil, moisturise daily, avoid harsh exfoliation, and pat skin dry after showering.'],
  ['What is Vanilla Veil for?', 'Vanilla Veil is a gradual tanning moisturiser designed for daily buildable glow and tan maintenance.'],
  ['What is Honey Dew Oil for?', 'Honey Dew Oil is designed to hydrate the skin and help extend the look of your tan.'],
  ['Can salons use Sorbet Pro Concentrate?', 'Yes. It is designed as a professional spray booth concentrate for trained spray tan operators and salon systems.'],
  ['Can I use Honey Dew Drops on my face?', 'Yes. Mix the drops with moisturiser, apply evenly, and wash hands after application.'],
  ['How do I remove old tan?', 'Use Coconut Melt, gently exfoliate, and moisturise before reapplying.'],
];

type FilterState = {
  shade: string[];
  category: string[];
  claims: string[];
  developmentTime: string[];
  scent: string[];
  sort: 'featured' | 'low' | 'high';
};

const initialFilters: FilterState = {
  shade: [],
  category: [],
  claims: [],
  developmentTime: [],
  scent: [],
  sort: 'featured',
};

function formatPrice(amount: number) {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return `$${amount.toFixed(hasCents ? 2 : 0)} AUD`;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function productById(id: string) {
  const product = productMap.get(id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}

function matchesClaim(product: Product, claim: string) {
  const lowerClaims = product.claims.map((item) => item.toLowerCase());
  const wanted = claim.toLowerCase();

  if (claim === 'Transfer-resistant') {
    return lowerClaims.some((item) => item.includes('transfer-resistant'));
  }

  if (claim === 'Foaming formula') {
    return product.category === 'Foaming Body Tan' || lowerClaims.some((item) => item.includes('foaming'));
  }

  if (claim === 'Gradual glow') {
    return product.category === 'Gradual Tanning Moisturiser' || lowerClaims.some((item) => item.includes('gradual'));
  }

  if (claim === 'Professional') {
    return product.category === 'Pro Spray' || lowerClaims.some((item) => item.includes('professional'));
  }

  return lowerClaims.some((item) => item.includes(wanted));
}

function getRecommendations(answers: QuizAnswerMap) {
  const tone = answers.tone;
  const result = answers.result;
  const timing = answers.timing;
  const skin = answers.skin;

  if (result === 'Professional spray result' || timing === 'Salon service') {
    return ['sorbet-pro-concentrate', 'coconut-melt', 'honey-dew-oil'];
  }

  if (timing === 'Tonight' || result === 'Instant event glow') {
    return ['champagne-blur', 'honey-dew-oil', 'velvet-mitt'];
  }

  if (result === 'Deep bronze' || tone === 'Deep') {
    return ['cocoa-drip', 'honey-dew-oil', 'velvet-mitt'];
  }

  if (skin === 'Dry' || result === 'Daily maintenance' || timing === 'Daily maintenance') {
    return ['vanilla-veil', 'honey-dew-oil', 'honey-dew-drops'];
  }

  if ((tone === 'Fair' || tone === 'Light') && result === 'Subtle glow') {
    return ['peach-glaze', 'vanilla-veil', 'velvet-mitt'];
  }

  if ((tone === 'Medium' || tone === 'Olive') && result === 'Golden bronze') {
    return ['caramel-cloud', 'honey-dew-oil', 'velvet-mitt'];
  }

  return ['peach-glaze', 'honey-dew-drops', 'honey-dew-oil'];
}

function useAnnouncementRotation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % rotatingMessages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return rotatingMessages[index];
}

function ProductRender({ product, size = 'md', float = false }: { product: Product; size?: 'sm' | 'md' | 'lg' | 'hero'; float?: boolean }) {
  const variant =
    product.category === 'Tool'
      ? 'mitt'
      : product.category === 'Face Drops'
        ? 'drops'
        : product.category === 'Tan Extender'
          ? 'oil'
          : product.category === 'Pro Spray'
            ? 'pro'
            : product.category === 'Prep Product'
              ? 'prep'
              : product.category === 'Instant Body Blur'
                ? 'blur'
                : 'mousse';

  return (
    <div
      className={cx('product-render', `product-render-${variant}`, `product-render-${size}`, float && 'animate-floaty')}
      style={{ '--accent': product.themeHex } as React.CSSProperties}
      role="img"
      aria-label={`${product.name} ${product.type} packaging mockup`}
    >
      <div className="product-glow" />
      {variant === 'mitt' ? (
        <div className="mitt-shape">
          <div className="mitt-cuff">Sorbet Skin</div>
        </div>
      ) : (
        <>
          <div className="product-cap" />
          <div className="product-body">
            <div className="product-highlight" />
            <div className="product-brand">SORBET SKIN</div>
            <div className="product-name">{product.name}</div>
            <div className="product-type">{product.type}</div>
          </div>
        </>
      )}
    </div>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-cocoa" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={15} className={index < Math.round(value) ? 'fill-honey text-honey' : 'text-caramel/30'} />
      ))}
      <span className="ml-1 text-sm font-bold">{value.toFixed(1)}</span>
    </div>
  );
}

function AnnouncementBar() {
  const message = useAnnouncementRotation();

  return (
    <div className="relative z-50 bg-cocoa px-4 py-2 text-center text-xs font-extrabold uppercase text-vanilla sm:text-sm">
      <span>Vegan. Cruelty-free. No fake tan smell. Free shipping over $80 AUD.</span>
      <span className="mx-3 hidden text-peach sm:inline">/</span>
      <span className="block normal-case text-buttercream sm:inline">{message}</span>
    </div>
  );
}

function Header({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkMarkup = (
    <>
      {navLinks.map(([label, id]) => (
        <a
          key={id}
          href={`#${id}`}
          className="rounded-full px-3 py-2 text-sm font-extrabold text-cocoa transition hover:bg-peach/30 hover:text-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
          onClick={() => setMobileOpen(false)}
        >
          {label}
        </a>
      ))}
    </>
  );

  return (
    <header className="relative z-40 border-b border-caramel/10 bg-vanilla/90 px-4 py-3 shadow-[0_8px_30px_rgba(107,65,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-3" aria-label="Sorbet Skin home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-peach via-blush to-lavender text-lg font-black text-cocoa shadow-button transition group-hover:rotate-6">
            SS
          </span>
          <span>
            <span className="block font-display text-2xl font-black leading-none text-cocoa">Sorbet Skin</span>
            <span className="block text-xs font-bold uppercase text-caramel">Whipped glow, zero sun damage.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {linkMarkup}
        </nav>

        <div className="flex items-center gap-2">
          <button className="icon-button" aria-label="Search Sorbet Skin">
            <Search size={20} />
          </button>
          <button className="icon-button relative" aria-label={`Open cart with ${cartCount} items`} onClick={onCartOpen}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blush px-1 text-[11px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button className="icon-button lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-2 rounded-[28px] border border-caramel/10 bg-white/75 p-3 shadow-soft lg:hidden" aria-label="Mobile navigation">
          {linkMarkup}
        </nav>
      )}
    </header>
  );
}

function Hero({ onQuickStart }: { onQuickStart: () => void }) {
  const heroProducts = ['peach-glaze', 'caramel-cloud', 'honey-dew-drops', 'honey-dew-oil'].map(productById);
  const badges = ['Vegan', 'Cruelty-free', 'No fake tan smell', 'Streak-free', 'Transfer-resistant after rinse', 'Naturally derived hero ingredients'];

  return (
    <section id="top" className="section-pad relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,#FFB38A55,transparent_28%),radial-gradient(circle_at_84%_12%,#B8A7FF55,transparent_30%),linear-gradient(135deg,#FFFDF6_0%,#FFF3DD_54%,#FFE2EC_100%)]">
      <div className="whipped-shape left-[4%] top-24 h-32 w-32 bg-white/60" />
      <div className="whipped-shape right-[8%] top-36 h-24 w-24 bg-mint/70" />
      <div className="bronze-ribbon animate-ribbon" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[0.98fr_1.02fr] lg:py-24">
        <div>
          <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.92] text-cocoa sm:text-6xl lg:text-7xl">
            Whipped self tan for soft golden skin.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-charcoal/80 sm:text-xl">
            Dessert-soft bronzing foams, gradual glow moisturiser, face drops, body blur, and tan-extending oil for a streak-free tan that looks expensive, not orange.
          </p>
          <div className="mt-5 flex items-end justify-center gap-2 rounded-[30px] bg-white/45 p-3 shadow-sm sm:hidden">
            <ProductRender product={heroProducts[0]} size="md" />
            <ProductRender product={heroProducts[2]} size="sm" />
            <ProductRender product={heroProducts[3]} size="sm" />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="primary-button" onClick={onQuickStart}>
              <WandSparkles size={20} />
              Find My Glow
            </button>
            <a className="secondary-button" href="#shop">
              Shop The Range
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="badge-pill bg-white/70 text-cocoa">
                <Sparkles size={14} />
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-bold text-cocoa/70">Self-tan does not contain SPF. Wear SPF daily.</p>
        </div>

        <div className="relative hidden min-h-[520px] sm:block">
          <div className="sorbet-orbit">
            <div className="scoop-shape scoop-one" />
            <div className="scoop-shape scoop-two" />
            <div className="foam-blob blob-one" />
            <div className="foam-blob blob-two" />
            <ProductRender product={heroProducts[0]} size="hero" float />
            <div className="absolute left-[44%] top-[7%] rotate-6">
              <ProductRender product={heroProducts[1]} size="lg" float />
            </div>
            <div className="absolute bottom-[12%] left-[10%] -rotate-6">
              <ProductRender product={heroProducts[2]} size="md" float />
            </div>
            <div className="absolute bottom-[8%] right-[11%] rotate-3">
              <ProductRender product={heroProducts[3]} size="md" float />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const badges = [
    { icon: Heart, title: 'Cruelty-free', copy: 'Never tested on animals.', tip: 'Brand positioning claim. Certification should be obtained before launch.', tone: 'bg-blush/18' },
    { icon: Leaf, title: 'Vegan', copy: 'No animal-derived ingredients.', tip: 'Designed as a vegan range with final checks before commercial launch.', tone: 'bg-mint/45' },
    { icon: Sparkles, title: 'No fake tan smell', copy: 'Made for glow without the old-school biscuit smell.', tip: 'A brand positioning claim subject to formulation testing.', tone: 'bg-peach/30' },
    { icon: Droplets, title: 'Streak-free', copy: 'Designed to blend smoothly with the Velvet Mitt.', tip: 'Prep and blending help the finish look smooth.', tone: 'bg-lavender/22' },
    { icon: ShieldCheck, title: 'Transfer-resistant', copy: 'Best once fully developed, rinsed, and dry.', tip: 'Careful claim language for real-world wear.', tone: 'bg-honey/18' },
    { icon: Leaf, title: 'Natural-origin hero ingredients', copy: 'Powered by skin-loving botanical ingredients.', tip: 'Naturally derived hero ingredients, not an unsupported all-natural claim.', tone: 'bg-buttercream' },
    { icon: Sun, title: 'SPF reminder', copy: 'Your glow is not UV protection. Wear SPF daily.', tip: 'Self-tan does not contain SPF.', tone: 'bg-white' },
  ];

  return (
    <section className="bg-vanilla px-4 py-5">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {badges.map(({ icon: Icon, title, copy, tip, tone }) => (
          <div key={title} className={cx('tooltip-card group rounded-[24px] border border-caramel/10 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft', tone)} tabIndex={0}>
            <Icon className="mb-3 text-cocoa" size={22} />
            <h3 className="text-sm font-black text-cocoa">{title}</h3>
            <p className="mt-1 text-xs font-semibold leading-5 text-charcoal/70">{copy}</p>
            <span className="tooltip-text">{tip}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
  onQuickView,
}: {
  product: Product;
  onAdd: (productId: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
}) {
  const hasNoSmell = product.claims.some((claim) => claim.toLowerCase().includes('no fake tan smell'));

  return (
    <article className="product-card group">
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-white via-buttercream to-peach/20 p-5">
        <div className="absolute inset-x-8 top-10 h-20 rounded-full blur-2xl" style={{ backgroundColor: `${product.themeHex}36` }} />
        <div className="relative mx-auto flex h-56 items-center justify-center">
          <ProductRender product={product} size="lg" />
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-cocoa shadow-sm">Vegan + cruelty-free</div>
        {hasNoSmell && <div className="absolute bottom-4 right-4 rounded-full bg-cocoa px-3 py-1 text-xs font-black text-vanilla shadow-sm">No fake tan smell</div>}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black leading-none text-cocoa">{product.name}</h3>
            <p className="mt-1 text-sm font-bold text-caramel">{product.type}</p>
          </div>
          <p className="shrink-0 rounded-full bg-buttercream px-3 py-1 text-sm font-black text-cocoa">{formatPrice(product.price)}</p>
        </div>

        <p className="mt-4 text-sm leading-6 text-charcoal/75">{product.copy}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="font-black text-cocoa">Shade</dt>
            <dd className="text-charcoal/70">{product.shade}</dd>
          </div>
          <div>
            <dt className="font-black text-cocoa">Scent</dt>
            <dd className="text-charcoal/70">{product.scent}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-black text-cocoa">Development</dt>
            <dd className="text-charcoal/70">{product.developmentTime}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.claims.slice(0, 4).map((claim) => (
            <span key={claim} className="mini-chip">
              {claim}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Rating value={product.rating} />
          <div className="flex gap-2">
            <button className="small-button bg-buttercream text-cocoa hover:bg-peach/40" onClick={() => onQuickView(product)}>
              Quick View
            </button>
            <button className="small-button bg-cocoa text-vanilla hover:bg-caramel" onClick={() => onAdd(product.id)}>
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase text-cocoa">
        <SlidersHorizontal size={15} />
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const active = selected.includes(value);
          return (
            <button key={value} className={cx('filter-chip', active && 'filter-chip-active')} onClick={() => onToggle(value)} aria-pressed={active}>
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductRange({
  onAdd,
  onQuickView,
}: {
  onAdd: (productId: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleFilter = (group: keyof Omit<FilterState, 'sort'>, value: string) => {
    setFilters((current) => ({
      ...current,
      [group]: current[group].includes(value) ? current[group].filter((item) => item !== value) : [...current[group], value],
    }));
  };

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const shadeMatch = filters.shade.length === 0 || filters.shade.includes(product.shade);
      const typeMatch = filters.category.length === 0 || filters.category.includes(product.category);
      const claimMatch = filters.claims.length === 0 || filters.claims.every((claim) => matchesClaim(product, claim));
      const developmentMatch = filters.developmentTime.length === 0 || filters.developmentTime.some((time) => product.developmentTime.toLowerCase().includes(time.toLowerCase()));
      const scentMatch = filters.scent.length === 0 || filters.scent.includes(product.scent);
      return shadeMatch && typeMatch && claimMatch && developmentMatch && scentMatch;
    });

    if (filters.sort === 'low') {
      return [...next].sort((a, b) => a.price - b.price);
    }

    if (filters.sort === 'high') {
      return [...next].sort((a, b) => b.price - a.price);
    }

    return next;
  }, [filters]);

  return (
    <section id="shop" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-7xl">
        <div className="section-heading">
          <h2>Shop the whipped glow range.</h2>
          <p>Foams, drops, body blur, prep, maintenance, and salon-ready pro concentrate, all dressed in shelf-pop sorbet colour.</p>
        </div>

        <div className="rounded-[32px] border border-caramel/10 bg-white/70 p-5 shadow-soft sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="grid gap-6">
              <FilterGroup label="Shade" values={shadeFilters} selected={filters.shade} onToggle={(value) => toggleFilter('shade', value)} />
              <FilterGroup label="Product type" values={typeFilters} selected={filters.category} onToggle={(value) => toggleFilter('category', value)} />
              <FilterGroup label="Claims" values={claimFilters} selected={filters.claims} onToggle={(value) => toggleFilter('claims', value)} />
              <FilterGroup label="Development time" values={developmentFilters} selected={filters.developmentTime} onToggle={(value) => toggleFilter('developmentTime', value)} />
              <FilterGroup label="Scent" values={scentFilters} selected={filters.scent} onToggle={(value) => toggleFilter('scent', value)} />
            </div>
            <div className="min-w-[210px]">
              <label htmlFor="price-sort" className="mb-3 block text-sm font-black uppercase text-cocoa">
                Price sorting
              </label>
              <select id="price-sort" className="w-full rounded-full border border-caramel/20 bg-vanilla px-4 py-3 text-sm font-black text-cocoa outline-none focus:border-blush" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as FilterState['sort'] }))}>
                <option value="featured">Featured</option>
                <option value="low">Low to high</option>
                <option value="high">High to low</option>
              </select>
              <button className="mt-4 w-full rounded-full bg-cocoa px-4 py-3 text-sm font-black text-vanilla transition hover:bg-caramel" onClick={() => setFilters(initialFilters)}>
                Reset filters
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm font-black uppercase text-caramel">{filteredProducts.length} products</p>
          <p className="text-sm font-bold text-charcoal/70">Transfer-resistant claim applies once fully developed, rinsed, and dry.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickViewModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (productId: string, quantity?: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'Details' | 'How to use' | 'Ingredients' | 'Safety'>('Details');

  useEffect(() => {
    if (!product) {
      return;
    }

    setQuantity(1);
    setTab('Details');
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, product]);

  if (!product) {
    return null;
  }

  const howToUse =
    product.category === 'Tool'
      ? ['Slip hand into the mitt.', 'Pump your foam or body blur onto the velvet side.', 'Blend in long sweeping motions and rinse the mitt after use.']
      : product.category === 'Pro Spray'
        ? ['For trained salon operators and compatible spray booth systems only.', 'Prep skin, apply evenly using a professional salon process, let colour develop, then rinse as directed.', 'Moisturise after rinsing and keep skin hydrated.']
        : product.category === 'Face Drops'
          ? ['Mix drops into moisturiser in your palm.', 'Apply evenly over face, neck, and hairline.', 'Wash hands after application and let glow develop overnight.']
          : product.category === 'Instant Body Blur'
            ? ['Apply to dry skin where you want instant bronze.', 'Blend with Velvet Mitt and allow to dry before dressing.', 'Wash off with body wash when ready.']
            : ['Apply to clean, dry skin using Velvet Mitt.', 'Blend in long sweeping motions and use sparingly on dry areas.', 'Allow to develop, rinse, dry fully, and wear SPF daily.'];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-cocoa/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="quick-view-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[36px] bg-vanilla shadow-gloss">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-gradient-to-br from-white via-buttercream to-peach/20 p-8">
            <ProductRender product={product} size="hero" />
          </div>
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-caramel">{product.category}</p>
                <h2 id="quick-view-title" className="mt-2 font-display text-4xl font-black leading-none text-cocoa">
                  {product.name}
                </h2>
                <p className="mt-2 text-lg font-bold text-charcoal/70">{product.type}</p>
              </div>
              <button className="icon-button bg-white" onClick={onClose} aria-label="Close quick view">
                <X size={21} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} />
              <span className="rounded-full bg-cocoa px-4 py-2 text-sm font-black text-vanilla">{formatPrice(product.price)}</span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                ['Shade', product.shade],
                ['Scent', product.scent],
                ['Finish', product.finish],
                ['Development', product.developmentTime],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] bg-white/70 p-3">
                  <dt className="font-black text-cocoa">{label}</dt>
                  <dd className="mt-1 text-charcoal/70">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.claims.map((claim) => (
                <span key={claim} className="mini-chip">
                  {claim}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-b border-caramel/10 pb-3">
              {(['Details', 'How to use', 'Ingredients', 'Safety'] as const).map((item) => (
                <button key={item} className={cx('tab-button', tab === item && 'tab-button-active')} onClick={() => setTab(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="min-h-40 py-5 text-charcoal/80">
              {tab === 'Details' && <p className="text-base font-semibold leading-7">{product.copy}</p>}
              {tab === 'How to use' && (
                <ol className="grid gap-3">
                  {howToUse.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-[22px] bg-white/60 p-3 font-semibold">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-peach text-sm font-black text-cocoa">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
              {tab === 'Ingredients' && (
                <div className="grid gap-3">
                  {product.heroIngredients.length > 0 ? (
                    product.heroIngredients.map((ingredient) => (
                      <div key={ingredient} className="rounded-[22px] bg-white/70 p-4">
                        <h3 className="font-black text-cocoa">{ingredient}</h3>
                        <p className="mt-1 text-sm font-semibold leading-6">{ingredientInfo[ingredient] ?? 'A beauty-focused hero ingredient selected for a soft skin feel.'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="font-semibold">Soft-touch reusable tool for blending Sorbet Skin formulas.</p>
                  )}
                </div>
              )}
              {tab === 'Safety' && (
                <ul className="grid gap-2 text-sm font-semibold leading-6">
                  <li>External use only.</li>
                  <li>Patch test before use.</li>
                  <li>Avoid eyes and broken skin.</li>
                  <li>Wash hands after application.</li>
                  <li>Self-tan does not contain SPF.</li>
                  <li>Wear SPF daily.</li>
                  <li>Stop use if irritation occurs.</li>
                  <li>Transfer-resistant claim applies once fully developed, rinsed, and dry.</li>
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-[28px] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button className="icon-button bg-buttercream" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                  <Minus size={18} />
                </button>
                <span className="min-w-8 text-center text-lg font-black text-cocoa">{quantity}</span>
                <button className="icon-button bg-buttercream" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity">
                  <Plus size={18} />
                </button>
              </div>
              <button className="primary-button justify-center" onClick={() => onAdd(product.id, quantity)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlowQuiz({
  onAddBundle,
  onQuickView,
}: {
  onAddBundle: (ids: string[], name: string, discountRate?: number) => void;
  onQuickView: (product: Product) => void;
}) {
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [step, setStep] = useState(0);
  const complete = Object.keys(answers).length === quizQuestions.length;
  const current = quizQuestions[step];
  const recommendationIds = complete ? getRecommendations(answers) : [];
  const recommendedProducts = recommendationIds.map(productById);
  const total = recommendedProducts.reduce((sum, product) => sum + product.price, 0);

  const choose = (answer: string) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answer }));
    setStep((currentStep) => Math.min(quizQuestions.length - 1, currentStep + 1));
  };

  const retake = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <section id="quiz" className="section-pad bg-gradient-to-br from-buttercream via-vanilla to-mint/40 px-4">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-kicker">Find My Glow</p>
          <h2 className="font-display text-4xl font-black leading-none text-cocoa sm:text-5xl">Your tan routine, minus the guesswork.</h2>
          <p className="mt-4 max-w-xl text-lg font-semibold leading-8 text-charcoal/75">
            Answer six quick beauty questions and Sorbet Skin will build a glow stack that fits your timing, skin vibe, scent mood, and finish.
          </p>
        </div>

        <div className="rounded-[36px] border border-caramel/10 bg-white/75 p-5 shadow-gloss sm:p-7">
          {!complete ? (
            <>
              <div className="mb-5 h-3 overflow-hidden rounded-full bg-buttercream">
                <div className="h-full rounded-full bg-gradient-to-r from-peach via-blush to-lavender transition-all" style={{ width: `${((Object.keys(answers).length + 1) / quizQuestions.length) * 100}%` }} />
              </div>
              <p className="text-sm font-black uppercase text-caramel">
                Question {step + 1} of {quizQuestions.length}
              </p>
              <h3 className="mt-2 font-display text-3xl font-black text-cocoa">{current.label}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((option) => (
                  <button key={option} className="quiz-option" onClick={() => choose(option)}>
                    {option}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button className="mt-5 text-sm font-black text-caramel underline decoration-peach decoration-4 underline-offset-4" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))}>
                  Back one question
                </button>
              )}
            </>
          ) : (
            <div>
              <p className="section-kicker">Your Sorbet match</p>
              <h3 className="font-display text-3xl font-black text-cocoa">A soft-focus routine built for you.</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {recommendedProducts.map((product) => (
                  <button key={product.id} className="rounded-[28px] bg-buttercream/70 p-4 text-left transition hover:-translate-y-1 hover:shadow-soft" onClick={() => onQuickView(product)}>
                    <ProductRender product={product} size="sm" />
                    <h4 className="mt-3 font-display text-xl font-black text-cocoa">{product.name}</h4>
                    <p className="text-sm font-bold text-caramel">{product.type}</p>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-[28px] bg-vanilla p-5">
                <h4 className="font-black text-cocoa">Custom routine</h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/75">
                  Prep skin, apply your recommended base with Velvet Mitt when included, layer face glow where needed, then keep skin hydrated so the glow fades evenly.
                </p>
                <p className="mt-3 text-lg font-black text-cocoa">Estimated total: {formatPrice(total)}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button className="primary-button justify-center" onClick={() => onAddBundle(recommendationIds, 'Find My Glow Bundle', 0.15)}>
                  Add Recommended Bundle
                </button>
                <button className="secondary-button justify-center" onClick={retake}>
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BundleBuilder({
  onAddBundle,
}: {
  onAddBundle: (ids: string[], name: string, discountRate?: number) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedProducts = selectedIds.map(productById);
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discount = selectedIds.length === 3 ? subtotal * 0.15 : 0;
  const finalPrice = subtotal - discount;

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length === 3) {
        return current;
      }

      return [...current, id];
    });
  };

  return (
    <section id="bundles" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-7xl">
        <div className="section-heading">
          <h2>Build Your Glow Stack</h2>
          <p>Pick your base, your face glow, and your finishing touch. Choose any 3 products and the 15 percent bundle discount drops in automatically.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {presetBundles.map((bundle) => (
                <button key={bundle.name} className="filter-chip bg-white" onClick={() => setSelectedIds(bundle.ids)}>
                  {bundle.name}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const active = selectedIds.includes(product.id);
                const disabled = selectedIds.length === 3 && !active;
                return (
                  <button key={product.id} className={cx('bundle-choice', active && 'bundle-choice-active')} disabled={disabled} onClick={() => toggle(product.id)} aria-pressed={active}>
                    <ProductRender product={product} size="sm" />
                    <span className="block font-display text-xl font-black text-cocoa">{product.name}</span>
                    <span className="block text-sm font-bold text-charcoal/70">{formatPrice(product.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="sticky top-32 h-fit rounded-[36px] border border-caramel/10 bg-gradient-to-br from-buttercream via-white to-peach/20 p-6 shadow-gloss">
            <p className="section-kicker">{selectedIds.length} of 3 selected</p>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-peach via-blush to-lavender transition-all" style={{ width: `${(selectedIds.length / 3) * 100}%` }} />
            </div>
            <div className="mt-5 grid gap-3">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-[20px] bg-white/70 px-4 py-3">
                    <span className="font-black text-cocoa">{product.name}</span>
                    <span className="font-bold text-caramel">{formatPrice(product.price)}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-[20px] bg-white/70 px-4 py-4 text-sm font-bold text-charcoal/70">Your stack is waiting for its first scoop.</p>
              )}
            </div>
            <dl className="mt-6 grid gap-2 text-sm font-bold text-charcoal/80">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-blush">
                <dt>Bundle discount</dt>
                <dd>-{formatPrice(discount)}</dd>
              </div>
              <div className="flex justify-between border-t border-caramel/15 pt-3 text-lg font-black text-cocoa">
                <dt>Final price</dt>
                <dd>{formatPrice(finalPrice)}</dd>
              </div>
            </dl>
            <button className="primary-button mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-45" disabled={selectedIds.length !== 3} onClick={() => onAddBundle(selectedIds, 'Build Your Glow Stack', 0.15)}>
              Add bundle to cart
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Routine({ onAdd }: { onAdd: (productId: string, quantity?: number) => void }) {
  const [openStep, setOpenStep] = useState(0);

  return (
    <section id="routine" className="section-pad bg-gradient-to-br from-peach/18 via-vanilla to-lavender/18 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="section-heading">
          <h2>Your streak-free Sorbet Skin routine.</h2>
          <p>Prep, apply, face, maintain, and extend. A beginner-friendly ritual that keeps glow clean, soft, and never orange.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          {routineSteps.map((step, index) => {
            const open = openStep === index;
            const primaryProduct = productById(step.productIds[0]);
            return (
              <article key={step.title} className="rounded-[32px] border border-caramel/10 bg-white/70 p-5 shadow-soft">
                <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setOpenStep(open ? -1 : index)} aria-expanded={open}>
                  <div>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-sm font-black text-vanilla">{index + 1}</span>
                    <h3 className="mt-4 font-display text-2xl font-black text-cocoa">{step.title}</h3>
                  </div>
                  <ChevronDown className={cx('transition', open && 'rotate-180')} />
                </button>
                <div className="mt-4">
                  <ProductRender product={primaryProduct} size="sm" />
                  <p className="mt-3 text-sm font-bold leading-6 text-charcoal/70">{step.copy}</p>
                </div>
                {open && (
                  <div className="mt-4 rounded-[24px] bg-buttercream/70 p-4">
                    <p className="text-sm font-black text-cocoa">Time: {step.time}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/70">Pro tip: {step.tip}</p>
                    <div className="mt-4 grid gap-2">
                      {step.productIds.map((id) => {
                        const product = productById(id);
                        return (
                          <button key={id} className="flex items-center justify-between rounded-full bg-white px-4 py-3 text-sm font-black text-cocoa transition hover:bg-peach/30" onClick={() => onAdd(id)}>
                            {product.name}
                            <Plus size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProSpray({
  onAdd,
  onGuideOpen,
}: {
  onAdd: (productId: string, quantity?: number) => void;
  onGuideOpen: () => void;
}) {
  const product = productById('sorbet-pro-concentrate');

  return (
    <section id="pro" className="section-pad bg-cocoa px-4 text-vanilla">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[440px] rounded-[40px] bg-gradient-to-br from-vanilla via-buttercream to-peach/70 p-8 shadow-gloss">
          <div className="absolute inset-6 rounded-[34px] border border-white/60" />
          <div className="relative flex h-full min-h-[380px] items-center justify-center">
            <ProductRender product={product} size="hero" float />
          </div>
        </div>
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-vanilla/12 px-4 py-2 text-sm font-black uppercase text-peach">
            <SprayCan size={18} />
            Professional
          </p>
          <h2 className="mt-5 font-display text-4xl font-black leading-none sm:text-6xl">Salon bronze, whipped into a pro concentrate.</h2>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-buttercream/85">
            A vegan, cruelty-free, low-odour spray booth concentrate designed for trained spray tan professionals and salon systems.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Professional badge', 'Vegan', 'Cruelty-free', 'No fake tan smell', 'Transfer-resistant once rinsed'].map((badge) => (
              <span key={badge} className="badge-pill border border-vanilla/18 bg-vanilla/10 text-vanilla">
                <BadgeCheck size={14} />
                {badge}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-2 text-sm font-bold leading-6 text-buttercream/80">
            <p>External use only.</p>
            <p>Patch test before use.</p>
            <p>Self-tan does not contain SPF. Wear SPF daily.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="primary-button bg-peach text-cocoa hover:bg-blush" onClick={() => onAdd(product.id)}>
              Add to cart
            </button>
            <button className="secondary-button border-vanilla/30 bg-vanilla/10 text-vanilla hover:bg-vanilla/18" onClick={onGuideOpen}>
              Application Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const steps = [
    'Prep skin 24 hours before',
    'Exfoliate old tan with Coconut Melt',
    'Apply barrier cream to dry areas',
    'Spray evenly using professional salon booth process',
    'Let colour develop',
    'Rinse as directed',
    'Moisturise with Vanilla Veil',
    'Finish with Honey Dew Oil to help maintain glow',
  ];

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-cocoa/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="guide-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[36px] bg-vanilla p-5 shadow-gloss sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Illustrated topical guide</p>
            <h2 id="guide-title" className="font-display text-4xl font-black leading-none text-cocoa">
              Sorbet Skin Spray Booth Application Guide
            </h2>
          </div>
          <button className="icon-button bg-white" onClick={onClose} aria-label="Close application guide">
            <X size={21} />
          </button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step} className="rounded-[28px] bg-gradient-to-br from-white to-buttercream p-5 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-peach to-blush text-2xl font-black text-cocoa">
                {index + 1}
              </div>
              <h3 className="font-display text-2xl font-black text-cocoa">{step}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/70">Topical spray tan use only. Follow salon equipment directions and keep skin comfort front and centre.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterSlider() {
  const [value, setValue] = useState(52);

  return (
    <section className="section-pad bg-vanilla px-4">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-kicker">Glow reveal</p>
          <h2 className="font-display text-4xl font-black leading-none text-cocoa sm:text-5xl">From soft neutral to golden bronze.</h2>
          <p className="mt-4 text-lg font-semibold leading-8 text-charcoal/75">Drag the slider to reveal a warm self-tan finish using original gradient placeholders, not copied imagery.</p>
        </div>
        <div className="before-after">
          <div className="before-layer" />
          <div className="after-layer" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} />
          <span className="ba-label left-4">Before</span>
          <span className="ba-label right-4">After</span>
          <div className="ba-handle" style={{ left: `${value}%` }} />
          <input className="ba-range" type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} aria-label="Before and after reveal amount" />
        </div>
      </div>
    </section>
  );
}

function IngredientLab() {
  const ingredientNames = Object.keys(ingredientInfo);
  const [selected, setSelected] = useState(ingredientNames[0]);

  return (
    <section id="ingredients" className="section-pad bg-gradient-to-br from-buttercream via-vanilla to-peach/20 px-4">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="section-kicker">Ingredient Lab</p>
          <h2 className="font-display text-4xl font-black leading-none text-cocoa sm:text-5xl">Naturally derived hero ingredients, explained softly.</h2>
          <div className="mt-7 flex flex-wrap gap-2">
            {ingredientNames.map((ingredient) => (
              <button key={ingredient} className={cx('ingredient-chip', selected === ingredient && 'ingredient-chip-active')} onClick={() => setSelected(ingredient)}>
                {ingredient}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[38px] bg-white/80 p-7 shadow-gloss">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-mint to-lavender text-cocoa">
            <Leaf size={30} />
          </div>
          <h3 className="font-display text-4xl font-black text-cocoa">{selected}</h3>
          <p className="mt-4 text-lg font-semibold leading-8 text-charcoal/75">{ingredientInfo[selected]}</p>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const active = reviews[index];

  const go = (direction: number) => {
    setIndex((current) => (current + direction + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-5xl">
        <div className="section-heading">
          <h2>Glow notes from the Sorbet shelf.</h2>
          <p>Mock reviews for a brand-ready demo experience, with tone and proof points aligned to the range.</p>
        </div>
        <div
          className="rounded-[40px] bg-gradient-to-br from-white via-buttercream to-blush/18 p-6 shadow-gloss sm:p-10"
          onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
          onTouchEnd={(event) => {
            if (touchStart === null) {
              return;
            }
            const diff = touchStart - event.changedTouches[0].clientX;
            if (Math.abs(diff) > 35) {
              go(diff > 0 ? 1 : -1);
            }
            setTouchStart(null);
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <Rating value={5} />
            <span className="rounded-full bg-cocoa px-4 py-2 text-sm font-black text-vanilla">Before and after badge</span>
          </div>
          <blockquote className="mt-8 font-display text-3xl font-black leading-tight text-cocoa sm:text-5xl">"{active.text}"</blockquote>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xl font-black text-cocoa">{active.name}</p>
              <p className="font-bold text-caramel">
                {active.skinTone} skin tone / {active.product}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="icon-button bg-white" onClick={() => go(-1)} aria-label="Previous review">
                <ArrowLeft size={20} />
              </button>
              <button className="icon-button bg-white" onClick={() => go(1)} aria-label="Next review">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section-pad bg-gradient-to-br from-mint/40 via-vanilla to-buttercream px-4">
      <div className="mx-auto max-w-4xl">
        <div className="section-heading">
          <h2>Glow questions, answered cleanly.</h2>
          <p>Clear beauty copy with careful claims, practical use guidance, and no sun-worship energy.</p>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="rounded-[28px] border border-caramel/10 bg-white/75 shadow-sm">
              <button className="flex w-full items-center justify-between gap-4 p-5 text-left" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
                <span className="font-display text-xl font-black text-cocoa">{question}</span>
                <ChevronDown className={cx('shrink-0 transition', open === index && 'rotate-180')} />
              </button>
              {open === index && <p className="px-5 pb-5 text-sm font-semibold leading-6 text-charcoal/75">{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-cocoa px-4 py-14 text-vanilla">
      <div className="mx-auto grid max-w-5xl items-center gap-6 rounded-[38px] bg-vanilla/10 p-6 shadow-gloss sm:p-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="font-display text-4xl font-black">Join the glow club.</h2>
          <p className="mt-3 text-lg font-semibold leading-8 text-buttercream/80">Get restock alerts, glow tips, routine guides, and first dibs on limited Sorbet Skin drops.</p>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (email.trim()) {
              setSubmitted(true);
            }
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input id="newsletter-email" className="min-h-14 flex-1 rounded-full border border-vanilla/20 bg-vanilla px-5 font-bold text-cocoa outline-none placeholder:text-caramel/70 focus:border-blush" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <button className="primary-button justify-center bg-peach text-cocoa hover:bg-blush" type="submit">
            Get glowing
          </button>
          {submitted && <p className="sm:col-span-2 rounded-full bg-mint px-4 py-3 text-sm font-black text-cocoa">You're in. Your glow routine just got an upgrade.</p>}
        </form>
      </div>
    </section>
  );
}

function CartDrawer({
  open,
  items,
  onClose,
  onUpdate,
  onRemove,
  onAdd,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdate: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  onAdd: (productId: string, quantity?: number) => void;
}) {
  const totals = useMemo(() => {
    return items.reduce(
      (summary, item) => {
        const product = productById(item.productId);
        const lineSubtotal = product.price * item.quantity;
        const lineDiscount = lineSubtotal * (item.discountRate ?? 0);
        summary.subtotal += lineSubtotal;
        summary.discount += lineDiscount;
        summary.total += lineSubtotal - lineDiscount;
        summary.count += item.quantity;
        return summary;
      },
      { subtotal: 0, discount: 0, total: 0, count: 0 },
    );
  }, [items]);

  const away = Math.max(0, 80 - totals.total);
  const progress = Math.min(100, (totals.total / 80) * 100);
  const hasOil = items.some((item) => item.productId === 'honey-dew-oil');

  return (
    <div className={cx('fixed inset-0 z-[90] transition', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div className={cx('absolute inset-0 bg-cocoa/45 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <aside className={cx('absolute right-0 top-0 flex h-full w-full max-w-md flex-col rounded-l-[34px] bg-vanilla shadow-gloss transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-start justify-between border-b border-caramel/10 p-5">
          <div>
            <p className="section-kicker">Cart</p>
            <h2 className="font-display text-3xl font-black text-cocoa">Your glow stack</h2>
          </div>
          <button className="icon-button bg-white" onClick={onClose} aria-label="Close cart">
            <X size={21} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5 rounded-[24px] bg-buttercream p-4">
            <div className="mb-2 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-peach to-blush" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm font-black text-cocoa">{away > 0 ? `You're ${formatPrice(away)} away from free shipping.` : 'Free shipping unlocked.'}</p>
          </div>

          {items.length === 0 ? (
            <p className="rounded-[28px] bg-white p-5 text-sm font-bold text-charcoal/70">Your cart is soft and empty. Add a foam, drops, or a glow stack to start.</p>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => {
                const product = productById(item.productId);
                return (
                  <div key={item.key} className="rounded-[28px] bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      <ProductRender product={product} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl font-black text-cocoa">{product.name}</h3>
                        <p className="text-sm font-bold text-caramel">{formatPrice(product.price)}</p>
                        {item.bundleName && <p className="mt-1 text-xs font-black uppercase text-blush">{item.bundleName}</p>}
                        <div className="mt-3 flex items-center gap-2">
                          <button className="quantity-button" onClick={() => onUpdate(item.key, item.quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>
                            <Minus size={15} />
                          </button>
                          <span className="w-8 text-center font-black text-cocoa">{item.quantity}</span>
                          <button className="quantity-button" onClick={() => onUpdate(item.key, item.quantity + 1)} aria-label={`Increase ${product.name} quantity`}>
                            <Plus size={15} />
                          </button>
                          <button className="quantity-button ml-auto text-blush" onClick={() => onRemove(item.key)} aria-label={`Remove ${product.name}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!hasOil && (
            <div className="mt-5 rounded-[28px] bg-gradient-to-br from-honey/22 to-peach/20 p-5">
              <h3 className="font-display text-2xl font-black text-cocoa">Add Honey Dew Oil to help extend your glow.</h3>
              <button className="small-button mt-4 bg-cocoa text-vanilla" onClick={() => onAdd('honey-dew-oil')}>
                Add Honey Dew Oil
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-caramel/10 p-5">
          <dl className="grid gap-2 text-sm font-bold text-charcoal/75">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-blush">
                <dt>Bundle discount</dt>
                <dd>-{formatPrice(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-caramel/15 pt-3 text-xl font-black text-cocoa">
              <dt>Total</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <button className="primary-button mt-5 w-full justify-center">Checkout</button>
          <p className="mt-3 text-center text-xs font-bold text-charcoal/60">Mock checkout for demo purposes.</p>
        </div>
      </aside>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className={cx('fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-cocoa px-5 py-3 text-sm font-black text-vanilla shadow-gloss transition', message ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
      {message}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-vanilla px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl font-black text-cocoa">Sorbet Skin</h2>
          <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-charcoal/70">Playful, premium, dessert-soft self-tanning bodycare for whipped glow without UV damage.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Cruelty-free', 'Vegan', 'No fake tan smell'].map((badge) => (
              <span key={badge} className="mini-chip bg-buttercream">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="footer-title">Shop</h3>
          {['Foaming Tan', 'Face Drops', 'Body Blur', 'Tan Prep', 'Pro Spray'].map((link) => (
            <a key={link} className="footer-link" href="#shop">
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="footer-title">Help</h3>
          {['Glow Quiz', 'Routine', 'Ingredients', 'Reviews', 'FAQ'].map((link) => (
            <a key={link} className="footer-link" href={`#${slug(link === 'Glow Quiz' ? 'quiz' : link)}`}>
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="footer-title">Social</h3>
          <div className="mb-5 flex flex-wrap gap-2">
            {['TikTok', 'Instagram', 'Pinterest'].map((link) => (
              <a key={link} className="filter-chip bg-white" href="#top">
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs font-semibold leading-5 text-charcoal/66">
            Sorbet Skin self-tan products do not contain SPF and do not protect against UV exposure. Wear SPF daily. External use only. Patch test before use. Claims such as vegan, cruelty-free, transfer-resistant, naturally derived, and no fake tan smell should be verified through formulation testing and certification before commercial launch. Claim subject to formulation testing and certification.
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-caramel/10 pt-6 text-xs font-bold text-charcoal/60">Copyright 2026 Sorbet Skin. Original concept demo.</p>
    </footer>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(cartStorageKey);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (productId: string, quantity = 1) => {
    const product = productById(productId);
    setCart((current) => {
      const existing = current.find((item) => item.key === productId);
      if (existing) {
        return current.map((item) => (item.key === productId ? { ...item, quantity: item.quantity + quantity } : item));
      }

      return [...current, { key: productId, productId, quantity }];
    });
    setToast(`${product.name} added to your glow stack.`);
  };

  const addBundle = (ids: string[], name: string, discountRate = 0.15) => {
    const bundleKey = `bundle-${slug(name)}-${Date.now()}`;
    setCart((current) => [
      ...current,
      ...ids.map((id) => ({
        key: `${bundleKey}-${id}`,
        productId: id,
        quantity: 1,
        bundleName: name,
        discountRate,
      })),
    ]);
    setToast(`${name} added with 15 percent off.`);
    setCartOpen(true);
  };

  const updateQuantity = (key: string, quantity: number) => {
    setCart((current) => current.flatMap((item) => (item.key === key ? (quantity <= 0 ? [] : [{ ...item, quantity }]) : [item])));
  };

  const removeItem = (key: string) => {
    setCart((current) => current.filter((item) => item.key !== key));
  };

  return (
    <div className="min-h-screen bg-vanilla font-body text-charcoal">
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      </div>
      <main>
        <Hero onQuickStart={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })} />
        <TrustStrip />
        <ProductRange onAdd={addToCart} onQuickView={setQuickProduct} />
        <GlowQuiz onAddBundle={addBundle} onQuickView={setQuickProduct} />
        <BundleBuilder onAddBundle={addBundle} />
        <Routine onAdd={addToCart} />
        <ProSpray onAdd={addToCart} onGuideOpen={() => setGuideOpen(true)} />
        <BeforeAfterSlider />
        <IngredientLab />
        <Reviews />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
      <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} onAdd={addToCart} />
      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onUpdate={updateQuantity} onRemove={removeItem} onAdd={addToCart} />
      <Toast message={toast} />
    </div>
  );
}
