import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  Heart,
  Home,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Phone,
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
  Truck,
  WandSparkles,
  X,
} from 'lucide-react';
import type { CSSProperties, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  announcementMessages,
  bridalPackages,
  bridalTimeline,
  faqs,
  giftOptions,
  navLinks,
  packages,
  prepChecklist,
  productMap,
  products,
  reviews,
  safetyNotes,
  serviceAddons,
  services,
  spfDisclaimer,
  quizQuestions,
} from './data/site';
import type { CartItem, Product, QuizAnswerMap, Service } from './types';

const cartStorageKey = 'sorbet-skin-cart-v2';

const shadeFilters = [...new Set(products.map((product) => product.shade))];
const typeFilters = [...new Set(products.map((product) => product.category))];
const developmentFilters = [...new Set(products.map((product) => product.developmentTime))];
const scentFilters = [...new Set(products.map((product) => product.scent))];
const claimFilters = ['Vegan', 'Cruelty-free', 'No fake tan smell', 'Streak-free', 'Transfer-resistant', 'Foaming formula', 'Buildable', 'Hydrating'];

type FilterState = {
  shade: string[];
  category: string[];
  developmentTime: string[];
  scent: string[];
  claims: string[];
  sort: 'featured' | 'low' | 'high';
};

const initialFilters: FilterState = {
  shade: [],
  category: [],
  developmentTime: [],
  scent: [],
  claims: [],
  sort: 'featured',
};

const toneExamples = [
  { name: 'Fair', before: '#f3c8b7', after: '#d99a54' },
  { name: 'Medium', before: '#d7a28c', after: '#b66f36' },
  { name: 'Deep', before: '#9b6a52', after: '#6b412a' },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatPrice(amount: number) {
  return `$${amount.toFixed(amount % 1 ? 2 : 0)} AUD`;
}

type LeadType = 'booking' | 'contact' | 'newsletter' | 'bridal' | 'competition' | 'mobile' | 'gift';

type CheckoutState = 'idle' | 'loading' | 'error';

async function submitLead(type: LeadType, payload: Record<string, unknown>) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload }),
  });

  const result = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? 'Unable to save your details. Please try again.');
  }
}

function formPayload(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries());
}

function catalogIdFromCartKey(item: CartItem) {
  const parts = item.key.split(':');
  return parts[1] ?? item.key;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
}

function matchesClaim(product: Product, claim: string) {
  const lower = product.claims.map((item) => item.toLowerCase());
  if (claim === 'Transfer-resistant') {
    return lower.some((item) => item.includes('transfer-resistant'));
  }
  if (claim === 'Foaming formula') {
    return product.category === 'Foaming Body Tan' || lower.some((item) => item.includes('foaming'));
  }
  return lower.some((item) => item.includes(claim.toLowerCase()));
}

function productById(id: string) {
  const product = productMap.get(id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}

function ProductRender({ product, size = 'md', float = false }: { product: Product; size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero'; float?: boolean }) {
  return (
    <div
      className={cx('product-render', `product-render-${size}`, float && 'animate-floaty')}
      style={{ '--accent': product.themeHex } as CSSProperties}
      role="img"
      aria-label={`${product.name} ${product.type} packaging mockup`}
    >
      <div className="product-glow" />
      <img className="product-asset" src={product.asset} alt="" aria-hidden="true" draggable={false} />
    </div>
  );
}

function Rating({ value = 5 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1 text-cocoa" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={15} className={index < Math.round(value) ? 'fill-honey text-honey' : 'text-caramel/30'} />
      ))}
      <span className="ml-1 text-xs font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx('field-input', props.className)} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx('field-input min-h-28 resize-y', props.className)} />;
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx('field-input', props.className)} />;
}

function SectionHeading({ eyebrow, title, copy, align = 'center' }: { eyebrow?: string; title: string; copy?: string; align?: 'center' | 'left' }) {
  return (
    <div className={cx('section-heading', align === 'left' && 'section-heading-left')}>
      {eyebrow && (
        <div className="section-label">
          <span className="section-rule" />
          <p className="section-kicker">{eyebrow}</p>
          <span className="section-rule" />
        </div>
      )}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % announcementMessages.length), 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-foreground px-4 py-2 text-center text-xs font-semibold uppercase text-background sm:text-sm">
      {announcementMessages[index]}
    </div>
  );
}

function Header({ cartCount, onCartOpen, onBook }: { cartCount: number; onCartOpen: () => void; onBook: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    if (id === 'book') {
      onBook();
      return;
    }
    scrollToId(id);
  };

  return (
    <header className="border-b border-border bg-background/92 px-4 py-3 shadow-editorial backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button className="group flex items-center gap-3 text-left" onClick={() => scrollToId('top')} aria-label="Sorbet Skin home">
          <span className="brand-mark">SS</span>
          <span>
            <span className="block font-display text-2xl font-normal leading-none text-foreground">Sorbet Skin</span>
            <span className="block text-[11px] font-semibold uppercase text-accent">Whipped glow, zero sun damage.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {navLinks.map(([label, id]) => (
            <button key={id} className="nav-link" onClick={() => handleNav(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="icon-button" aria-label="Search Sorbet Skin" onClick={() => setSearchOpen((open) => !open)}>
            <Search size={20} />
          </button>
          <button className="icon-button relative" aria-label={`Open cart with ${cartCount} items`} onClick={onCartOpen}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="primary-button hidden min-h-11 px-5 py-2 text-sm lg:inline-flex" onClick={onBook}>
            Book Now
          </button>
          <button className="icon-button xl:hidden" aria-label="Open menu" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-lg border border-border bg-card p-3 shadow-soft">
          <label className="flex items-center gap-3 rounded-md bg-muted px-4 py-3 text-sm font-normal text-muted-foreground">
            <Search size={18} className="text-accent" />
            <input className="w-full bg-transparent outline-none" placeholder="Search services, products, prep guides..." />
          </label>
        </div>
      )}

      {mobileOpen && (
        <nav className="mx-auto mt-4 grid max-w-7xl gap-2 rounded-lg border border-border bg-card p-3 shadow-soft sm:grid-cols-2 xl:hidden" aria-label="Mobile navigation">
          {navLinks.map(([label, id]) => (
            <button key={id} className="nav-link justify-start" onClick={() => handleNav(id)}>
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  const badges = ['Vegan bodycare', 'Cruelty-free glow', 'Dessert-inspired scents', 'No fake tan smell', 'Shop bundles', 'Studio tans', 'Mobile tanning'];
  const heroProducts = ['peach-glaze', 'cocoa-drip', 'honey-dew-drops'].map(productById);

  return (
    <section id="top" className="relative overflow-hidden bg-background px-4 pb-16 pt-14 sm:pb-20 lg:pb-28">
      <div className="bronze-ribbon animate-ribbon" />
      <div className="whipped-shape left-[4%] top-24 h-32 w-32 bg-white/58" />
      <div className="whipped-shape right-[9%] top-40 h-24 w-24 bg-card/60" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-fadeUp">
          <h1 className="max-w-4xl font-display text-5xl font-normal leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Vegan, cruelty-free bodycare for your juiciest glow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-8 text-muted-foreground sm:text-xl">
            Whipped self-tan, body butters, lip balms, cleansers, masks, studio spray tans, and mobile glow appointments wrapped in bright sorbet colour.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button className="primary-button" onClick={() => scrollToId('shop')}>
              <ShoppingBag size={20} />
              Shop Best Sellers
            </button>
            <button className="secondary-button" onClick={() => scrollToId('shop')}>
              Build a Bundle
            </button>
            <button className="ghost-button" onClick={() => scrollToId('quiz')}>
              Find My Glow
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span key={badge} className="badge-pill fade-badge" style={{ animationDelay: `${index * 70}ms` }}>
                <Sparkles size={14} />
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">{spfDisclaimer}</p>
        </div>

        <div className="relative min-h-[440px] sm:min-h-[560px]">
          <div className="hero-image-card">
            <img src="/assets/generated/sorbet-hero-lifestyle.png" alt="Sorbet Skin colourful self-tan and whipped bodycare collection on a bright bathroom counter" />
            <div className="hero-shine" />
          </div>
          <div className="absolute -left-2 bottom-8 hidden rotate-[-8deg] sm:block">
            <ProductRender product={heroProducts[0]} size="lg" float />
          </div>
          <div className="absolute -right-2 top-16 hidden rotate-[7deg] sm:block">
            <ProductRender product={heroProducts[1]} size="md" float />
          </div>
          <div className="absolute bottom-2 right-20 hidden rotate-[5deg] md:block">
            <ProductRender product={heroProducts[2]} size="sm" float />
          </div>
          <div className="foam-stroke left-[10%] top-[8%]" />
          <div className="foam-stroke bottom-[12%] right-[9%]" />
        </div>
      </div>
    </section>
  );
}

function SocialProofStrip() {
  const items = [
    ['Custom colour matched', BadgeCheck],
    ['Studio and mobile appointments', Truck],
    ['Bridal glow specialists', Heart],
    ['Competition tanning', Sparkles],
    ['Prep and aftercare education', ShieldCheck],
    ['At-home glow products', ShoppingBag],
  ] as const;

  return (
    <section className="border-y border-caramel/10 bg-warmwhite px-4 py-5">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {items.map(([label, Icon]) => (
          <div key={label} className="proof-card">
            <Icon size={20} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BestSellersStory({ onAdd, onQuickView }: { onAdd: (product: Product, quantity?: number) => void; onQuickView: (product: Product) => void }) {
  const heroProducts = ['peach-glaze', 'vanilla-veil', 'raspberry-body-butter', 'honey-dew-drops']
    .map((id) => productMap.get(id))
    .filter(Boolean) as Product[];
  const displayProducts = heroProducts.length >= 4 ? heroProducts : products.slice(0, 4);

  return (
    <section className="section-pad bg-buttercream px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Shop the best sellers"
            title="Bodycare, but make it fun."
            copy="Sorbet-bright formulas, glossy product moments, and add-to-cart routines designed to feel like a treat from first click."
          />
          <div className="editorial-product-frame">
            <img src="/assets/generated/sorbet-product-collection.png" alt="Sorbet Skin bodycare range arranged on a colourful pastel ecommerce set" />
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingPanel({ onBook }: { onBook: (service?: Service) => void }) {
  return (
    <section id="book" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Book online" title="Choose Your Glow Appointment" copy="Salon-grade spray tan services for everyday glow, weddings, mobile appointments, and stage-ready bronze." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tag-pill">{service.bestFor}</p>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-none text-cocoa">{service.name}</h3>
                </div>
                <span className="price-pill">{service.price}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-foreground/80">
                <span className="mini-chip"><Clock size={14} /> {service.duration}</span>
                <span className="mini-chip"><Sparkles size={14} /> {service.developmentTime}</span>
              </div>
              <p className="mt-5 text-sm font-medium leading-7 text-charcoal/70">{service.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button className="primary-button min-h-11 flex-1 justify-center px-4 py-2 text-sm" onClick={() => onBook(service)}>
                  Book Now
                </button>
                <button className="secondary-button min-h-11 flex-1 px-4 py-2 text-sm" onClick={() => scrollToId('prep-care')}>
                  View Prep Guide
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage({ onBook }: { onBook: (service?: Service) => void }) {
  const categories = [
    ['Studio Tanning', 'Custom colour matching, skin tone consultation, rinse guidance, and a soft bronze finish.'],
    ['Express Tanning', 'Fast-developing services for last-minute events and shorter rinse windows.'],
    ['Mobile Tanning', 'Professional setup brought to your home, hotel, or event location.'],
    ['Bridal Tanning', 'Trial-led bridal colour planning for dress tone, photography, and wedding timing.'],
    ['Competition Tanning', 'Deeper bronze timing for stage lighting, performance events, and show schedules.'],
    ['Group Bookings', 'Bridal parties, events, dance teams, and content days with coordinated timing.'],
  ];

  return (
    <section id="services" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Service menu" title="Professional tanning, built around your calendar." copy="Every appointment includes prep guidance, colour consultation, and aftercare notes. Self-tan does not contain SPF and does not protect against UV exposure. Wear SPF daily." />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(([title, copy]) => (
            <div key={title} className="soft-panel p-6">
              <Sparkles className="text-caramel" size={24} />
              <h3 className="mt-4 font-display text-2xl font-semibold text-cocoa">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-7 text-charcoal/70">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="soft-panel p-6">
            <h3 className="font-display text-3xl font-semibold text-cocoa">Add-ons</h3>
            <div className="mt-5 grid gap-3">
              {serviceAddons.map((addon) => (
                <div key={addon.name} className="addon-row">
                  <div>
                    <h4>{addon.name}</h4>
                    <p>{addon.copy}</p>
                  </div>
                  <span>{addon.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="soft-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Best for</th>
                    <th>Development time</th>
                    <th>Price</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{service.bestFor}</td>
                      <td>{service.developmentTime}</td>
                      <td>{service.price}</td>
                      <td>
                        <button className="small-button bg-cocoa text-vanilla hover:bg-caramel" onClick={() => onBook(service)}>
                          Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PackagesSection({ onAdd }: { onAdd: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void }) {
  const [gifted, setGifted] = useState<Record<string, boolean>>({});

  return (
    <section id="packages" className="section-pad bg-muted px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Prepaid packages" title="Glow More, Pay Less" copy="Prepay for your studio tans, keep them for yourself, or gift the glow to someone who lives by calendar reminders." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pack) => (
            <article key={pack.id} className="package-card">
              {pack.badge && <span className="save-badge">{pack.badge}</span>}
              <h3 className="font-display text-3xl font-semibold text-cocoa">{pack.name}</h3>
              <p className="mt-3 text-sm font-bold text-charcoal/70">{pack.includes}</p>
              <p className="mt-6 font-display text-4xl font-normal text-foreground">{formatPrice(pack.price)}</p>
              <label className="mt-5 flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={!!gifted[pack.id]} onChange={(event) => setGifted((current) => ({ ...current, [pack.id]: event.target.checked }))} />
                Gift option
              </label>
              <button
                className="primary-button mt-5 w-full justify-center"
                onClick={() =>
                  onAdd(
                    {
                      key: `package:${pack.id}:${gifted[pack.id] ? 'gift' : 'self'}`,
                      kind: 'package',
                      name: pack.name,
                      price: pack.price,
                      meta: `${pack.includes}${gifted[pack.id] ? ' | Gift option' : ''}`,
                      accent: '#B8860B',
                    },
                    1,
                  )
                }
              >
                Add to cart
              </button>
              <p className="mt-4 text-xs font-bold leading-5 text-charcoal/60">Valid for 12 months from purchase. Appointment availability applies.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BridalPage({ onBook }: { onBook: (service?: Service) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  return (
    <section id="bridal" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-7xl">
        <div className="bridal-hero">
          <div>
            <p className="section-kicker">Bridal Glow</p>
            <h2 className="font-display text-5xl font-semibold leading-none text-cocoa sm:text-6xl">Your wedding glow, colour matched.</h2>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-charcoal/75">
              Bridal tans need softer planning: dress colour, photography, trial timing, party coordination, and a rinse plan that fits your wedding week.
            </p>
            <button className="primary-button mt-7" onClick={() => onBook(services.find((service) => service.id === 'bridal-trial-tan'))}>
              Book Trial Tan
            </button>
          </div>
          <div className="editorial-skin-frame bridal-skin">
            <img src="/assets/generated/sorbet-bridal-service.png" alt="Sorbet Skin warm bridal and spray tanning service editorial" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="soft-panel p-6">
            <h3 className="font-display text-3xl font-semibold text-cocoa">Why bridal tans need a trial</h3>
            <p className="mt-4 text-sm font-medium leading-7 text-charcoal/70">
              A trial lets us test colour depth, undertone, fade pattern, and comfort before your final wedding week tan. It helps the finished glow feel like skin, not a surprise.
            </p>
            <div className="mt-5 grid gap-3">
              {['Trial tan booking', 'Wedding week tan', 'Mobile bridal tanning', 'Bridal party packages', 'FAQ-ready prep notes'].map((item) => (
                <div key={item} className="check-row">
                  <Check size={17} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="soft-panel p-6">
            <h3 className="font-display text-3xl font-semibold text-cocoa">Bridal timeline</h3>
            <div className="mt-5 grid gap-3">
              {bridalTimeline.map(([time, task]) => (
                <div key={time} className="timeline-row">
                  <span>{time}</span>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bridalPackages.map((pack) => (
            <article key={pack.name} className="package-card">
              <h3 className="font-display text-2xl font-semibold text-cocoa">{pack.name}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-charcoal/70">{pack.includes}</p>
              <p className="mt-5 font-display text-3xl font-normal text-accent">{pack.price}</p>
            </article>
          ))}
        </div>

        <form
          className="form-panel mt-8"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              await submitLead('bridal', formPayload(event.currentTarget));
              setSubmitted(true);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : 'Unable to send your bridal request.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <p className="section-kicker">Quote request</p>
            <h3 className="font-display text-3xl font-semibold text-cocoa">Plan the bridal party glow.</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Name"><TextInput name="name" required /></Field>
            <Field label="Email"><TextInput name="email" type="email" required /></Field>
            <Field label="Wedding date"><TextInput name="weddingDate" type="date" required /></Field>
            <Field label="Location"><TextInput name="location" placeholder="Suburb or venue" required /></Field>
            <Field label="Bridal party size"><TextInput name="partySize" type="number" min="1" placeholder="5" /></Field>
            <Field label="Dress colour"><TextInput name="dressColour" placeholder="Ivory, white, blush..." /></Field>
            <Field label="Skin tone"><SelectInput name="skinTone"><option>Fair</option><option>Light</option><option>Medium</option><option>Olive</option><option>Deep</option></SelectInput></Field>
            <Field label="Desired colour"><SelectInput name="desiredColour"><option>Soft bridal glow</option><option>Golden bronze</option><option>Deeper bronze</option></SelectInput></Field>
          </div>
          {error && <p className="error-message">{error}</p>}
          {submitted ? <p className="success-message">Your bridal glow request has been received. We will be in touch with a tailored quote.</p> : <button className="primary-button w-fit" disabled={submitting}>{submitting ? 'Sending...' : 'Request Bridal Quote'}</button>}
        </form>
      </div>
    </section>
  );
}

function MobileTanningPage({ onBook }: { onBook: (service?: Service) => void }) {
  const [people, setPeople] = useState(1);
  const [postcode, setPostcode] = useState('');
  const [serviceType, setServiceType] = useState('Signature mobile');
  const base = serviceType === 'Bridal mobile' ? 145 : serviceType === 'Competition mobile' ? 130 : 95;
  const estimate = base + Math.max(0, people - 1) * 45 + (postcode.length >= 4 && !postcode.startsWith('3') ? 25 : 0);

  return (
    <section id="mobile" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Mobile tanning" title="Sorbet Skin comes to you." copy="A professional mobile tanning setup for homes, hotels, bridal suites, group bookings, and event prep across selected Melbourne areas." />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['How mobile tanning works', 'Tell us your date, location, group size, and tan goals. We confirm timing, setup, and travel notes.'],
              ['Service area', 'Selected Melbourne suburbs with travel notes based on postcode, parking, and appointment time.'],
              ['Pricing', 'Mobile tans start from $95, with group pricing and bridal quotes available.'],
              ['Group bookings', 'Perfect for bridal parties, event squads, dance teams, and content days.'],
            ].map(([title, copy]) => (
              <div key={title} className="soft-panel p-6">
                <Truck className="text-caramel" size={24} />
                <h3 className="mt-4 font-display text-2xl font-semibold text-cocoa">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-charcoal/70">{copy}</p>
              </div>
            ))}
          </div>

          <div className="soft-panel p-6">
            <div className="map-placeholder">
              <span>Melbourne</span>
              <i className="pin pin-one" />
              <i className="pin pin-two" />
              <i className="pin pin-three" />
            </div>
            <h3 className="mt-6 font-display text-3xl font-semibold text-cocoa">Setup requirements</h3>
            <div className="mt-4 grid gap-2">
              {['Private space', 'Good lighting', 'Power access if required', 'Ventilation', 'Loose dark clothing ready', 'No deodorant, perfume, or moisturiser on skin'].map((item) => (
                <div key={item} className="check-row"><Check size={17} /> {item}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="calculator-panel mt-8">
          <div>
            <p className="section-kicker">Mobile booking calculator</p>
            <h3 className="font-display text-3xl font-semibold text-cocoa">Estimate your starting price.</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Field label="Postcode"><TextInput value={postcode} onChange={(event) => setPostcode(event.target.value)} placeholder="3000" /></Field>
            <Field label="People"><TextInput type="number" min="1" value={people} onChange={(event) => setPeople(Number(event.target.value))} /></Field>
            <Field label="Service type"><SelectInput value={serviceType} onChange={(event) => setServiceType(event.target.value)}><option>Signature mobile</option><option>Bridal mobile</option><option>Competition mobile</option></SelectInput></Field>
            <Field label="Event date"><TextInput type="date" /></Field>
            <Field label="Preferred time"><TextInput type="time" /></Field>
          </div>
          <div className="quote-output">
            <div>
              <span>Estimated starting price</span>
              <strong>{formatPrice(estimate)}</strong>
              <p>Travel confirmed after postcode, parking, and setup details are reviewed.</p>
            </div>
            <button className="primary-button" onClick={() => onBook(services.find((service) => service.id === 'mobile-tan'))}>
              Request Mobile Booking
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompetitionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  return (
    <section id="competition" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="section-kicker">Competition Bronze</p>
            <h2 className="font-display text-5xl font-semibold leading-none text-cocoa">Stage-ready bronze for fitness, dance, pageant, and performance clients.</h2>
            <p className="mt-5 text-lg font-medium leading-8 text-charcoal/75">
              Competition tans are built around lighting, schedule, suit or costume colour, and event-day touch points. We keep the guidance practical and skin-safe.
            </p>
          </div>
          <div className="soft-panel p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Why competition tans are different', 'Stage lighting can flatten colour, so depth and timing matter.'],
                ['Base coat and top coat education', 'Plan the right appointment rhythm for your event format.'],
                ['Event-day timing', 'Book early and leave room for follow-up guidance.'],
                ['Skin prep', 'Hydrate skin in the days before, then arrive with clean, dry skin.'],
                ['Deep bronze options', 'Choose depth around show lighting and category needs.'],
                ['Rinse instructions', 'Follow your personalised rinse timing and aftercare notes.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[24px] bg-vanilla/80 p-4">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-charcoal/70">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[24px] bg-cocoa p-5 text-sm font-bold leading-7 text-vanilla">
              Book early. Avoid moisturiser and deodorant before application. Wear loose clothing. Follow rinse instructions. Hydrate skin in the days before appointment.
            </div>
          </div>
        </div>

        <form
          className="form-panel mt-8"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              await submitLead('competition', formPayload(event.currentTarget));
              setSubmitted(true);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : 'Unable to send your competition request.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <p className="section-kicker">Booking form</p>
            <h3 className="font-display text-3xl font-semibold text-cocoa">Tell us about the event.</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Name"><TextInput name="name" required /></Field>
            <Field label="Email"><TextInput name="email" type="email" required /></Field>
            <Field label="Event type"><SelectInput name="eventType"><option>Fitness</option><option>Dance</option><option>Pageant</option><option>Performance</option></SelectInput></Field>
            <Field label="Event date"><TextInput name="eventDate" type="date" required /></Field>
          </div>
          <Field label="Notes"><TextArea name="notes" placeholder="Show time, category, costume colour, preferred depth..." /></Field>
          {error && <p className="error-message">{error}</p>}
          {submitted ? <p className="success-message">Your competition bronze request has been received. We will confirm timing shortly.</p> : <button className="primary-button w-fit" disabled={submitting}>{submitting ? 'Sending...' : 'Request Competition Booking'}</button>}
        </form>
      </div>
    </section>
  );
}

function FilterGroup({ label, values, selected, onToggle }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-medium uppercase text-foreground">
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

function ProductCard({ product, onAdd, onQuickView }: { product: Product; onAdd: (product: Product, quantity?: number) => void; onQuickView: (product: Product) => void }) {
  return (
    <article className="product-card group">
      <div className="product-card-media">
        <div className="absolute inset-x-8 top-10 h-20 rounded-full blur-2xl" style={{ backgroundColor: `${product.themeHex}22` }} />
        <ProductRender product={product} size="lg" />
        <span className="absolute left-4 top-4 rounded-md border border-border bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">Vegan + cruelty-free</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-semibold leading-none text-cocoa">{product.name}</h3>
            <p className="mt-1 text-sm font-bold text-caramel">{product.type}</p>
          </div>
          <p className="price-pill shrink-0">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-4 text-sm font-medium leading-6 text-charcoal/70">{product.copy}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt>Shade</dt><dd>{product.shade}</dd></div>
          <div><dt>Scent</dt><dd>{product.scent}</dd></div>
          <div className="col-span-2"><dt>Development</dt><dd>{product.developmentTime}</dd></div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.claims.slice(0, 4).map((claim) => <span key={claim} className="mini-chip">{claim}</span>)}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Rating value={product.rating} />
          <div className="flex gap-2">
            <button className="small-button bg-card text-foreground hover:bg-muted" onClick={() => onQuickView(product)}>Quick view</button>
            <button className="small-button bg-cocoa text-vanilla hover:bg-caramel" onClick={() => onAdd(product)}>Add to cart</button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ShopPage({ onAdd, onQuickView }: { onAdd: (product: Product, quantity?: number) => void; onQuickView: (product: Product) => void }) {
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
      const developmentMatch = filters.developmentTime.length === 0 || filters.developmentTime.includes(product.developmentTime);
      const scentMatch = filters.scent.length === 0 || filters.scent.includes(product.scent);
      const claimMatch = filters.claims.length === 0 || filters.claims.every((claim) => matchesClaim(product, claim));
      return shadeMatch && typeMatch && developmentMatch && scentMatch && claimMatch;
    });
    if (filters.sort === 'low') return [...next].sort((a, b) => a.price - b.price);
    if (filters.sort === 'high') return [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [filters]);

  return (
    <section id="shop" className="section-pad bg-vanilla px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Shop" title="Self-tanning products, dressed like dessert." copy="Foaming body tan, gradual glow, face drops, body blur, prep, and tools for a beginner-friendly routine that feels salon-grade." />

        <div className="filter-panel">
          <div className="grid gap-6">
            <FilterGroup label="Shade" values={shadeFilters} selected={filters.shade} onToggle={(value) => toggleFilter('shade', value)} />
            <FilterGroup label="Product type" values={typeFilters} selected={filters.category} onToggle={(value) => toggleFilter('category', value)} />
            <FilterGroup label="Development time" values={developmentFilters} selected={filters.developmentTime} onToggle={(value) => toggleFilter('developmentTime', value)} />
            <FilterGroup label="Scent" values={scentFilters} selected={filters.scent} onToggle={(value) => toggleFilter('scent', value)} />
            <FilterGroup label="Claims" values={claimFilters} selected={filters.claims} onToggle={(value) => toggleFilter('claims', value)} />
          </div>
          <div className="min-w-[220px]">
            <Field label="Sort products">
              <SelectInput value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as FilterState['sort'] }))}>
                <option value="featured">Featured</option>
                <option value="low">Price low to high</option>
                <option value="high">Price high to low</option>
              </SelectInput>
            </Field>
            <button className="secondary-button mt-4 w-full min-h-11" onClick={() => setFilters(initialFilters)}>Reset filters</button>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm font-medium uppercase text-accent">{filteredProducts.length} products</p>
          <p className="text-sm font-bold text-charcoal/70">Transfer-resistant claim applies once fully developed, rinsed, and dry.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onQuickView={onQuickView} />)}
        </div>
      </div>
    </section>
  );
}

function QuickViewModal({ product, onClose, onAdd }: { product: Product | null; onClose: () => void; onAdd: (product: Product, quantity?: number) => void }) {
  const [tab, setTab] = useState<'Details' | 'How to Use' | 'Ingredients' | 'Safety'>('Details');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setTab('Details');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, product]);

  if (!product) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="quick-view-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card max-w-5xl">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-border bg-muted p-8">
            <ProductRender product={product} size="hero" />
          </div>
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">{product.category}</p>
                <h2 id="quick-view-title" className="font-display text-4xl font-semibold leading-none text-cocoa">{product.name}</h2>
                <p className="mt-2 text-lg font-bold text-charcoal/70">{product.type}</p>
              </div>
              <button className="icon-button bg-white" onClick={onClose} aria-label="Close quick view"><X size={21} /></button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} />
              <span className="price-pill">{formatPrice(product.price)}</span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                ['Shade', product.shade],
                ['Scent', product.scent],
                ['Finish', product.finish],
                ['Development', product.developmentTime],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] bg-white/70 p-3">
                  <dt className="font-semibold text-foreground">{label}</dt>
                  <dd className="mt-1 font-medium text-charcoal/70">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.claims.map((claim) => <span key={claim} className="mini-chip">{claim}</span>)}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-b border-caramel/10 pb-3">
              {(['Details', 'How to Use', 'Ingredients', 'Safety'] as const).map((item) => (
                <button key={item} className={cx('tab-button', tab === item && 'tab-button-active')} onClick={() => setTab(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="min-h-40 py-5 text-sm font-medium leading-7 text-charcoal/80">
              {tab === 'Details' && <p>{product.copy}</p>}
              {tab === 'How to Use' && (
                <ol className="grid gap-3">
                  {product.howToUse.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-[20px] bg-white/70 p-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-foreground">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
              {tab === 'Ingredients' && (
                <div className="grid gap-3">
                  {product.ingredients.map((item) => <p key={item} className="rounded-[20px] bg-white/70 p-4">{item}</p>)}
                </div>
              )}
              {tab === 'Safety' && (
                <ul className="grid gap-2">
                  {safetyNotes.map((note) => <li key={note}>{note}</li>)}
                  <li>Wash hands after application.</li>
                  <li>Self-tan does not contain SPF.</li>
                  <li>Wear SPF daily.</li>
                  <li>Transfer-resistant claim applies once fully developed, rinsed, and dry.</li>
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-[24px] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button className="quantity-button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={18} /></button>
                <span className="min-w-8 text-center text-lg font-semibold text-foreground">{quantity}</span>
                <button className="quantity-button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={18} /></button>
              </div>
              <button className="primary-button justify-center" onClick={() => onAdd(product, quantity)}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlowQuiz({ onBook, onAddProducts }: { onBook: (service?: Service) => void; onAddProducts: (ids: string[]) => void }) {
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [step, setStep] = useState(0);
  const complete = Object.keys(answers).length === quizQuestions.length;
  const current = quizQuestions[step];

  const result = useMemo(() => {
    if (!complete) return null;
    if (answers.event === 'Wedding month' || answers.result === 'Bridal glow') {
      return {
        title: 'Bridal Trial Tan + bridal maintenance',
        serviceId: 'bridal-trial-tan',
        ids: ['vanilla-veil', 'honey-dew-drops'],
        prep: 'Book your trial 6 to 8 weeks before, then finalise colour 2 weeks before.',
      };
    }
    if (answers.event === 'Tonight' || answers.result === 'Instant event glow') {
      return {
        title: 'Express Glow Tan + instant polish',
        serviceId: 'express-glow-tan',
        ids: ['champagne-blur', 'velvet-mitt'],
        prep: 'Choose express service, wear loose clothing, and keep skin dry until first rinse.',
      };
    }
    if (answers.event === 'Competition week' || answers.result === 'Competition bronze') {
      return {
        title: 'Competition Bronze + prep foam',
        serviceId: 'competition-bronze',
        ids: ['coconut-melt'],
        prep: 'Book early, prep skin well, and follow event timing instructions.',
      };
    }
    if (answers.result === 'Deep bronze' || answers.tone === 'Deep') {
      return {
        title: 'Deep bronze at-home routine',
        serviceId: undefined,
        ids: ['cocoa-drip', 'velvet-mitt', 'champagne-blur'],
        prep: 'Prep 24 hours before, apply express foam, then use body blur for event polish.',
      };
    }
    if (answers.event === 'No event, daily glow') {
      return {
        title: 'Daily gradual glow',
        serviceId: undefined,
        ids: ['vanilla-veil', 'honey-dew-drops'],
        prep: 'Apply gradual glow daily or every second day and hydrate skin between applications.',
      };
    }
    return {
      title: 'At-home beginner glow',
      serviceId: undefined,
      ids: ['peach-glaze', 'coconut-melt', 'velvet-mitt'],
      prep: 'Remove old tan, exfoliate 24 hours before, then apply Peach Glaze with Velvet Mitt.',
    };
  }, [answers, complete]);

  const choose = (answer: string) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answer }));
    setStep((currentStep) => Math.min(quizQuestions.length - 1, currentStep + 1));
  };

  const recommendedProducts = result ? result.ids.map(productById) : [];
  const service = result?.serviceId ? services.find((item) => item.id === result.serviceId) : undefined;
  const estimated = recommendedProducts.reduce((sum, product) => sum + product.price, 0) + (service?.numericPrice ?? 0);

  return (
    <section id="quiz" className="section-pad bg-muted px-4">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-kicker">Find My Glow</p>
          <h2 className="font-display text-5xl font-semibold leading-none text-cocoa">Find My Glow</h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-charcoal/75">
            Match your event, skin tone, preferred format, and finish to a Sorbet Skin appointment or at-home product routine.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
          {!complete ? (
            <>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((Object.keys(answers).length + 1) / quizQuestions.length) * 100}%` }} />
              </div>
              <p className="section-kicker">Question {step + 1} of {quizQuestions.length}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-cocoa">{current.label}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((option) => (
                  <button key={option} className="quiz-option" onClick={() => choose(option)}>
                    {option}
                  </button>
                ))}
              </div>
              {step > 0 && <button className="mt-5 text-sm font-semibold text-accent underline decoration-accent decoration-1 underline-offset-4" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))}>Back one question</button>}
            </>
          ) : result && (
            <div>
              <p className="section-kicker">Your recommendation</p>
              <h3 className="font-display text-3xl font-semibold text-cocoa">{result.title}</h3>
              <p className="mt-3 text-sm font-medium leading-7 text-charcoal/75">{result.prep}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {service && (
                  <div className="rounded-[24px] bg-buttercream/80 p-4">
                    <SprayCan className="text-caramel" />
                    <h4 className="mt-3 font-display text-xl font-semibold text-cocoa">{service.name}</h4>
                    <p className="mt-1 text-sm font-bold text-charcoal/70">{service.price}</p>
                  </div>
                )}
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="rounded-[24px] bg-buttercream/80 p-4">
                    <ProductRender product={product} size="sm" />
                    <h4 className="mt-2 font-display text-xl font-semibold text-cocoa">{product.name}</h4>
                    <p className="text-sm font-bold text-charcoal/70">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[24px] bg-vanilla p-5">
                <h4 className="font-semibold text-foreground">Prep timeline</h4>
                <p className="mt-2 text-sm font-medium leading-6 text-charcoal/70">{result.prep}</p>
                <p className="mt-3 text-lg font-semibold text-foreground">Estimated cost: {formatPrice(estimated)}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button className="primary-button justify-center" onClick={() => service ? onBook(service) : scrollToId('shop')}>Book recommended glow</button>
                <button className="secondary-button justify-center" onClick={() => onAddProducts(result.ids)}>Add product routine to cart</button>
                <button className="ghost-button justify-center" onClick={() => { setAnswers({}); setStep(0); }}>Retake</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PrepCarePage() {
  const [eventDate, setEventDate] = useState('');
  const [serviceType, setServiceType] = useState('Signature Studio Tan');
  const [dryness, setDryness] = useState('Normal');
  const [depth, setDepth] = useState('Golden bronze');
  const date = eventDate ? new Date(`${eventDate}T12:00:00`) : null;

  return (
    <section id="prep-care" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Prep & Care" title="Tan Prep & Care" copy="Good prep is the difference between a nice tan and a glow that looks expensive." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Before Your Tan', prepChecklist],
            ['Appointment Day', ['Arrive with clean, dry skin', 'No deodorant, perfume, oils, or moisturiser', 'Wear loose dark clothing', 'Bring slides or loose shoes']],
            ['First Rinse', ['Follow your appointment instructions', 'Rinse with lukewarm water', 'Avoid soap during first rinse', 'Pat skin dry', 'Let colour continue developing']],
            ['Aftercare', ['Moisturise daily', 'Avoid harsh exfoliation', 'Use gentle cleanser', 'Pat dry after showering', 'Use gradual glow products for maintenance']],
            ['How to Extend Your Glow', ['Hydrate daily', 'Use Vanilla Veil for gradual glow', 'Use gentle cleanser', 'Avoid long hot baths', 'Pat skin dry']],
            ['What to Avoid', ['Heavy oils before dressing', 'Sweating before first rinse', 'Tight clothing after application', 'Harsh scrubs on fresh tan', 'Skipping SPF outdoors']],
          ].map(([title, items]) => (
            <div key={title as string} className="soft-panel p-6">
              <h3 className="font-display text-2xl font-semibold text-cocoa">{title as string}</h3>
              <div className="mt-4 grid gap-2">
                {(items as string[]).map((item) => <div key={item} className="check-row"><Check size={17} /> {item}</div>)}
              </div>
            </div>
          ))}
        </div>

        <div className="calculator-panel mt-8">
          <div>
            <p className="section-kicker">Downloadable Checklist</p>
            <h3 className="font-display text-3xl font-semibold text-cocoa">Tan Timeline Builder</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Event date"><TextInput type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></Field>
            <Field label="Service type"><SelectInput value={serviceType} onChange={(event) => setServiceType(event.target.value)}>{services.map((service) => <option key={service.id}>{service.name}</option>)}</SelectInput></Field>
            <Field label="Skin dryness level"><SelectInput value={dryness} onChange={(event) => setDryness(event.target.value)}><option>Dry</option><option>Normal</option><option>Oily</option><option>Sensitive</option></SelectInput></Field>
            <Field label="Desired colour"><SelectInput value={depth} onChange={(event) => setDepth(event.target.value)}><option>Subtle glow</option><option>Golden bronze</option><option>Deep bronze</option></SelectInput></Field>
          </div>
          <div className="timeline-output">
            {date ? (
              <>
                <div><span>Prep date</span><strong>{formatDate(addDays(date, -2))}</strong></div>
                <div><span>Shaving/waxing date</span><strong>{formatDate(addDays(date, -2))} to {formatDate(addDays(date, -1))}</strong></div>
                <div><span>Appointment window</span><strong>{formatDate(addDays(date, -1))}</strong></div>
                <div><span>First rinse reminder</span><strong>Follow your {serviceType} instructions</strong></div>
              </>
            ) : (
              <p className="text-sm font-bold text-charcoal/70">Choose an event date to generate your prep date, shaving window, appointment window, first rinse reminder, and aftercare checklist.</p>
            )}
          </div>
          <p className="text-sm font-bold text-charcoal/70">Skin dryness: {dryness}. Desired colour: {depth}. Moisturise daily after first rinse to help extend the look of your tan.</p>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const [position, setPosition] = useState(52);
  const [tone, setTone] = useState(toneExamples[1]);

  return (
    <section className="section-pad bg-vanilla px-4">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-kicker">Before and after</p>
          <h2 className="font-display text-5xl font-semibold leading-none text-cocoa">A soft-focus glow comparison.</h2>
          <p className="mt-5 text-lg font-medium leading-8 text-charcoal/75">Consent-safe generated skin-tone gradients show colour direction without using real client photos.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {toneExamples.map((example) => (
              <button key={example.name} className={cx('filter-chip', tone.name === example.name && 'filter-chip-active')} onClick={() => setTone(example)}>
                {example.name}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-charcoal/70">Results vary based on skin tone, prep, application, and aftercare.</p>
        </div>
        <div>
          <div className="before-after" style={{ '--before-tone': tone.before, '--after-tone': tone.after, '--split': `${position}%` } as CSSProperties}>
            <div className="before-layer" />
            <div className="after-layer" />
            <span className="ba-label left-4">Before</span>
            <span className="ba-label right-4">After</span>
            <div className="ba-handle" />
          </div>
          <input className="mt-5 w-full accent-cocoa" type="range" min="15" max="85" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Drag before and after comparison slider" />
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const next = () => setIndex((current) => (current + 1) % reviews.length);
  const prev = () => setIndex((current) => (current - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="section-pad bg-muted px-4">
      <div className="mx-auto max-w-5xl text-center">
        <p className="section-kicker">Reviews</p>
        <h2 className="font-display text-5xl font-semibold leading-none text-cocoa">Five-star glow notes.</h2>
        <div className="review-card mt-8">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"><BadgeCheck size={17} /> Verified glow</div>
          <div className="mt-5 flex justify-center"><Rating value={5} /></div>
          <p className="mt-6 text-2xl font-medium leading-9 text-charcoal/80">"{review.text}"</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="mini-chip">{review.serviceProduct}</span>
            <span className="mini-chip">Skin tone: {review.skinTone}</span>
            <span className="mini-chip">{review.eventType}</span>
          </div>
          <p className="mt-5 font-display text-2xl font-semibold text-cocoa">{review.name}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="icon-button bg-buttercream" onClick={prev} aria-label="Previous review"><ChevronLeft size={20} /></button>
            <div className="flex gap-2">
              {reviews.map((item, itemIndex) => <button key={item.name} className={cx('h-2.5 rounded-full transition-all', index === itemIndex ? 'w-8 bg-cocoa' : 'w-2.5 bg-caramel/30')} onClick={() => setIndex(itemIndex)} aria-label={`Show review ${itemIndex + 1}`} />)}
            </div>
            <button className="icon-button bg-buttercream" onClick={next} aria-label="Next review"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  return (
    <section id="contact" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Location & contact" title="Melbourne studio location" copy="Appointment-only tanning with mobile service enquiries available by request." />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="soft-panel p-6">
            <div className="map-placeholder studio-map">
              <span>Melbourne studio location</span>
              <i className="pin pin-two" />
            </div>
            <div className="mt-6 grid gap-3 text-sm font-bold text-charcoal/75">
              <div className="check-row"><MapPin size={17} /> Melbourne studio location</div>
              <div className="check-row"><Clock size={17} /> Monday to Sunday: 9:30am to 8:00pm</div>
              <div className="check-row"><CalendarDays size={17} /> Appointments outside standard hours available by request.</div>
              <div className="check-row"><Mail size={17} /> hello@sorbetskin.example</div>
              <div className="check-row"><Phone size={17} /> 0400 000 000</div>
              <div className="check-row"><Instagram size={17} /> @sorbetskin</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="primary-button min-h-11 px-5 py-2 text-sm">Directions</button>
              <button className="secondary-button min-h-11 px-5 py-2 text-sm" onClick={() => scrollToId('mobile')}>Mobile service enquiry</button>
            </div>
          </div>

          <form
            className="form-panel"
            onSubmit={async (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setSubmitting(true);
              setError('');
              try {
                await submitLead('contact', formPayload(event.currentTarget));
                setSubmitted(true);
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : 'Unable to send your message.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div>
              <p className="section-kicker">Contact form</p>
              <h3 className="font-display text-3xl font-semibold text-cocoa">Ask us anything glow-related.</h3>
            </div>
            <Field label="Name"><TextInput name="name" required /></Field>
            <Field label="Email"><TextInput name="email" type="email" required /></Field>
            <Field label="Message"><TextArea name="message" placeholder="Event date, service, product question, or mobile enquiry..." /></Field>
            {error && <p className="error-message">{error}</p>}
            {submitted ? <p className="success-message">Thanks. Your message has been received.</p> : <button className="primary-button w-fit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>}
          </form>
        </div>
      </div>
    </section>
  );
}

function GiftCertificates({ onAdd }: { onAdd: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void }) {
  const [selected, setSelected] = useState(giftOptions[0].id);
  const [custom, setCustom] = useState(75);
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const option = giftOptions.find((giftOption) => giftOption.id === selected) ?? giftOptions[0];
  const price = option.id === 'gift-custom' ? custom : option.price;

  return (
    <section id="gifts" className="section-pad bg-vanilla px-4">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-kicker">Gift certificates</p>
          <h2 className="font-display text-5xl font-semibold leading-none text-cocoa">Give a glow that books itself.</h2>
          <p className="mt-5 text-lg font-medium leading-8 text-charcoal/75">Choose a value, write the message, and add a mock digital gift certificate to cart.</p>
        </div>
        <form
          className="form-panel"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              await submitLead('gift', { ...formPayload(event.currentTarget), giftId: selected, price });
              onAdd({
                key: `gift:${selected}:${recipient}:${sender}:${price}`,
                kind: 'gift',
                name: option.name,
                price,
                meta: `To ${recipient || 'recipient'} from ${sender || 'sender'}`,
                accent: '#FF9FB8',
              });
              setSubmitted(true);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : 'Unable to save the gift details.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Gift value"><SelectInput name="giftValue" value={selected} onChange={(event) => setSelected(event.target.value)}>{giftOptions.map((giftOption) => <option key={giftOption.id} value={giftOption.id}>{giftOption.name}</option>)}</SelectInput></Field>
            {selected === 'gift-custom' && <Field label="Custom amount"><TextInput name="customAmount" type="number" min="25" value={custom} onChange={(event) => setCustom(Number(event.target.value))} /></Field>}
            <Field label="Recipient name"><TextInput name="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} required /></Field>
            <Field label="Sender name"><TextInput name="sender" value={sender} onChange={(event) => setSender(event.target.value)} required /></Field>
            <Field label="Delivery method"><SelectInput name="deliveryMethod"><option>Email certificate</option><option>Print-ready PDF</option><option>Send later</option></SelectInput></Field>
            <Field label="Message"><TextInput name="message" placeholder="A soft glow for your next big moment." /></Field>
          </div>
          {error && <p className="error-message">{error}</p>}
          {submitted && <p className="success-message">Gift details saved and added to cart.</p>}
          <div className="quote-output">
            <div>
              <span>Selected gift</span>
              <strong>{formatPrice(price)}</strong>
              <p>{option.name}</p>
            </div>
            <button className="primary-button" disabled={submitting}><Gift size={20} /> {submitting ? 'Saving...' : 'Add Gift Certificate'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section-pad bg-warmwhite px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="FAQ" title="Glow questions, answered." copy="Product pages, service pages, FAQ, and footer all include SPF and safety guidance." />
        <div className="grid gap-3">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="faq-item">
              <button className="faq-button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
                {faq.question}
                <ChevronDown className={cx('transition', open === index && 'rotate-180')} size={20} />
              </button>
              {open === index && <p className="px-5 pb-5 text-sm font-medium leading-7 text-charcoal/70">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  return (
    <section className="border-y border-border bg-foreground px-4 py-20 text-background">
      <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-display text-4xl font-normal leading-tight sm:text-5xl">Join the glow club.</h2>
          <p className="mt-4 text-base font-normal leading-7 text-background/78">Get appointment reminders, glow tips, product drops, bridal timelines, and prep checklists.</p>
        </div>
        <form
          className="flex flex-col gap-3 rounded-lg border border-white/15 bg-white/10 p-3 sm:flex-row"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              await submitLead('newsletter', formPayload(event.currentTarget));
              setSuccess(true);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : 'Unable to join the list.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <input name="email" className="min-h-11 flex-1 rounded-md border border-white/20 bg-white/95 px-5 font-normal text-foreground outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground" type="email" placeholder="Email address" required />
          <button className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-secondary hover:text-foreground" disabled={submitting}>{submitting ? 'Joining...' : 'Get glowing'}</button>
        </form>
        {error && <p className="md:col-start-2 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-background">{error}</p>}
        {success && <p className="md:col-start-2 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-background">You're in. Your glow routine just got an upgrade.</p>}
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    ['Book', ['Book Now', 'Studio Tanning', 'Mobile Tanning', 'Competition Bronze']],
    ['Services', ['Signature Studio Tan', 'Express Glow Tan', 'Bridal Glow', 'Group Bookings']],
    ['Shop', ['Peach Glaze', 'Caramel Cloud', 'Cocoa Drip', 'Velvet Mitt']],
    ['Learn', ['Prep & Care', 'Glow Quiz', 'FAQ', 'Before & After']],
    ['Customer Care', ['Contact', 'Gift Certificates', 'Shipping', 'Returns']],
    ['Social', ['Instagram', 'TikTok', 'Pinterest', 'Reviews']],
  ];
  return (
    <footer className="bg-vanilla px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="brand-mark">SS</span>
              <div>
                <p className="font-display text-3xl font-normal leading-none text-foreground">Sorbet Skin</p>
                <p className="text-xs font-semibold uppercase text-accent">Whipped glow, zero sun damage.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Vegan', 'Cruelty-free', 'No fake tan smell'].map((badge) => <span key={badge} className="badge-pill" >{badge}</span>)}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {columns.map(([title, links]) => (
              <div key={title as string}>
                <h3 className="footer-title">{title as string}</h3>
                {(links as string[]).map((link) => <button key={link} className="footer-link">{link}</button>)}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 rounded-lg border border-border bg-card p-5 text-xs font-normal leading-6 text-muted-foreground">
          <p>Sorbet Skin self-tan products do not contain SPF and do not protect against UV exposure. Wear SPF daily. External use only. Patch test before use. Claims such as vegan, cruelty-free, transfer-resistant, naturally derived, and no fake tan smell should be verified through formulation testing and certification before commercial launch.</p>
          <p className="mt-3">External use only. Patch test before use. Avoid eyes and broken skin. Stop use if irritation occurs.</p>
          <p className="mt-3">Copyright 2026 Sorbet Skin. Original mock brand and website concept.</p>
        </div>
      </div>
    </footer>
  );
}

function BookingModal({ service, open, onClose }: { service?: Service; open: boolean; onClose: () => void }) {
  const [selectedService, setSelectedService] = useState(service?.name ?? services[0].name);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedService(service?.name ?? services[0].name);
      setSuccess(false);
      setSubmitting(false);
      setError('');
    }
  }, [open, service]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card max-w-4xl p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Book online</p>
            <h2 id="booking-title" className="font-display text-4xl font-semibold leading-none text-cocoa">Choose Your Glow Appointment</h2>
          </div>
          <button className="icon-button bg-white" onClick={onClose} aria-label="Close booking modal"><X size={21} /></button>
        </div>

        {success ? (
          <div className="mt-8 rounded-lg border border-accent/25 bg-accent/10 p-6">
            <h3 className="font-display text-3xl font-semibold text-cocoa">Your glow request has been received.</h3>
            <p className="mt-3 text-sm font-bold leading-7 text-charcoal/75">We will confirm your appointment shortly.</p>
          </div>
        ) : (
          <form
            className="mt-6 grid gap-4"
            onSubmit={async (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setSubmitting(true);
              setError('');
              try {
                await submitLead('booking', formPayload(event.currentTarget));
                setSuccess(true);
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : 'Unable to save your booking request.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Name"><TextInput name="name" required /></Field>
              <Field label="Email"><TextInput name="email" type="email" required /></Field>
              <Field label="Phone"><TextInput name="phone" type="tel" required /></Field>
              <Field label="Service"><SelectInput name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>{services.map((item) => <option key={item.id}>{item.name}</option>)}</SelectInput></Field>
              <Field label="Preferred date"><TextInput name="preferredDate" type="date" required /></Field>
              <Field label="Preferred time"><TextInput name="preferredTime" type="time" required /></Field>
              <Field label="Studio or mobile"><SelectInput name="locationType"><option>Studio</option><option>Mobile</option></SelectInput></Field>
              <Field label="Event date"><TextInput name="eventDate" type="date" /></Field>
              <Field label="Skin tone"><SelectInput name="skinTone"><option>Fair</option><option>Light</option><option>Medium</option><option>Olive</option><option>Deep</option></SelectInput></Field>
              <Field label="Desired colour depth"><SelectInput name="desiredDepth"><option>Subtle glow</option><option>Golden bronze</option><option>Deep bronze</option><option>Competition bronze</option></SelectInput></Field>
            </div>
            <Field label="Notes"><TextArea name="notes" placeholder="Event type, rinse timing, allergies, mobile setup notes..." /></Field>
            <p className="text-xs font-bold leading-6 text-charcoal/70">{spfDisclaimer} External use only. Patch test before use.</p>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button w-fit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Glow Request'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  items,
  onClose,
  onUpdate,
  onRemove,
  onAddProduct,
  onCheckout,
  checkoutState,
  checkoutError,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdate: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  onAddProduct: (product: Product) => void;
  onCheckout: () => void;
  checkoutState: CheckoutState;
  checkoutError: string;
}) {
  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const progress = Math.min(100, (subtotal / 80) * 100);
  const upsells = ['velvet-mitt', 'coconut-melt', 'vanilla-veil', 'champagne-blur'].map(productById);

  return (
    <div className={cx('cart-overlay', open && 'cart-overlay-open')} aria-hidden={!open}>
      <div className="cart-scrim" onClick={onClose} />
      <aside className={cx('cart-drawer', open && 'cart-drawer-open')} aria-label="Cart drawer">
        <div className="flex items-start justify-between gap-4 border-b border-caramel/10 p-5">
          <div>
            <p className="section-kicker">Your cart</p>
            <h2 className="font-display text-3xl font-semibold text-cocoa">Glow bag</h2>
          </div>
          <button className="icon-button bg-buttercream" onClick={onClose} aria-label="Close cart"><X size={21} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-[28px] bg-buttercream/70 p-6 text-center">
              <ShoppingBag className="mx-auto text-caramel" />
              <p className="mt-3 font-bold text-charcoal/70">Your glow bag is empty.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((item) => (
                <div key={item.key} className="cart-line">
                  <div className="cart-line-icon" style={{ backgroundColor: item.accent ?? '#F5F3F0' }}><PackageCheck size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <h3>{item.name}</h3>
                    {item.meta && <p>{item.meta}</p>}
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="quantity-button" onClick={() => onUpdate(item.key, Math.max(1, item.quantity - 1))} aria-label={`Decrease ${item.name}`}><Minus size={15} /></button>
                    <span className="w-5 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button className="quantity-button" onClick={() => onUpdate(item.key, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus size={15} /></button>
                  </div>
                  <button className="icon-button h-9 w-9 bg-white" onClick={() => onRemove(item.key)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-[24px] bg-white/75 p-4">
            <div className="flex justify-between text-sm font-semibold text-foreground"><span>Free shipping progress</span><span>{subtotal >= 80 ? 'Unlocked' : `${formatPrice(80 - subtotal)} to go`}</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} /></div>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-sm font-medium uppercase text-foreground">Suggested upsells</h3>
            <div className="mt-3 grid gap-3">
              {upsells.map((product) => (
                <button key={product.id} className="upsell-row" onClick={() => onAddProduct(product)}>
                  <ProductRender product={product} size="xs" />
                  <span>{product.name}</span>
                  <strong>{formatPrice(product.price)}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-caramel/10 p-5">
          <div className="flex items-center justify-between text-lg font-semibold text-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          {checkoutError && <p className="error-message mt-4">{checkoutError}</p>}
          <button className="primary-button mt-4 w-full justify-center" onClick={onCheckout} disabled={checkoutState === 'loading' || items.length === 0}>
            {checkoutState === 'loading' ? 'Opening secure checkout...' : 'Secure checkout'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return <div className="toast"><Sparkles size={18} /> {message}</div>;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(cartStorageKey);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<Service | undefined>();
  const [toast, setToast] = useState('');
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    if (checkout === 'success') {
      setCart([]);
      setToast('Payment received. Your Sorbet Skin order is confirmed.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (checkout === 'cancelled') {
      setToast('Checkout cancelled. Your glow bag is still saved.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const addLine = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.key === item.key);
      if (existing) {
        return current.map((line) => (line.key === item.key ? { ...line, quantity: line.quantity + quantity } : line));
      }
      return [...current, { ...item, quantity }];
    });
    setToast(`${item.name} added to cart.`);
  };

  const addProduct = (product: Product, quantity = 1) => {
    addLine(
      {
        key: `product:${product.id}`,
        kind: 'product',
        name: product.name,
        price: product.price,
        meta: product.type,
        accent: product.themeHex,
      },
      quantity,
    );
  };

  const addProducts = (ids: string[]) => {
    ids.map(productById).forEach((product) => addProduct(product));
    setToast('Your product routine was added to cart.');
  };

  const openBooking = (service?: Service) => {
    setBookingService(service);
    setBookingOpen(true);
  };

  const startCheckout = async () => {
    setCheckoutState('loading');
    setCheckoutError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: catalogIdFromCartKey(item),
            quantity: item.quantity,
            meta: item.meta,
            amount: catalogIdFromCartKey(item) === 'gift-custom' ? item.price : undefined,
          })),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? 'Unable to open secure checkout.');
      }

      window.location.href = result.url;
    } catch (error) {
      setCheckoutState('error');
      setCheckoutError(error instanceof Error ? error.message : 'Unable to open secure checkout.');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-vanilla font-body text-charcoal">
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onBook={() => openBooking()} />
      </div>

      <main>
        <Hero onBook={() => openBooking()} />
        <SocialProofStrip />
        <BestSellersStory onAdd={addProduct} onQuickView={setQuickViewProduct} />
        <ShopPage onAdd={addProduct} onQuickView={setQuickViewProduct} />
        <BookingPanel onBook={openBooking} />
        <ServicesPage onBook={openBooking} />
        <PackagesSection onAdd={addLine} />
        <BridalPage onBook={openBooking} />
        <MobileTanningPage onBook={openBooking} />
        <CompetitionPage />
        <GlowQuiz onBook={openBooking} onAddProducts={addProducts} />
        <PrepCarePage />
        <BeforeAfterSection />
        <ReviewsSection />
        <LocationContactSection />
        <GiftCertificates onAdd={addLine} />
        <FAQSection />
        <NewsletterSection />
      </main>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAdd={addProduct} />
      <BookingModal service={bookingService} open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdate={(key, quantity) => setCart((current) => current.map((item) => (item.key === key ? { ...item, quantity } : item)))}
        onRemove={(key) => setCart((current) => current.filter((item) => item.key !== key))}
        onAddProduct={addProduct}
        onCheckout={startCheckout}
        checkoutState={checkoutState}
        checkoutError={checkoutError}
      />
      {toast && <Toast message={toast} />}
    </div>
  );
}
