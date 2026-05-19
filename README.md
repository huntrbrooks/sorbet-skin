# Sorbet Skin

Sorbet Skin is an original premium self-tanning and spray tanning website for a Melbourne-based studio and at-home glow product range.

Tagline: **Whipped glow, zero sun damage.**

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Local component state
- `localStorage` cart persistence

## Project Structure

```text
.
├── index.html
├── public/
│   ├── favicon.svg
│   └── Product Line.png
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── data/
│       ├── products.ts
│       └── site.ts
├── tailwind.config.ts
├── tsconfig*.json
└── vite.config.ts
```

## Included Experiences

- Sticky rotating announcement bar and sticky responsive navigation
- Booking modal with mock success state
- Studio, express, mobile, bridal, and competition tanning sections
- Prepaid packages with cart integration
- Mobile tanning calculator
- Bridal quote form
- Competition booking form
- E-commerce shop with filters, sorting, quick view, and safety tabs
- Working cart drawer with quantity controls, free shipping progress, upsells, and mock checkout
- Glow Quiz with recommendations and product routine cart action
- Tan Timeline Builder
- Before/after slider using consent-safe generated gradients
- Review carousel
- FAQ accordion
- Gift certificate flow
- Newsletter success state
- SPF and external-use disclaimers across relevant surfaces

## Local Setup

```bash
npm install
npm run dev
```

The Vite dev server will print the local URL. In this workspace it is currently running at `http://localhost:5174/` because port 5173 was already in use.

## Production Build

```bash
npm run build
```

## Notes

This is a frontend-only demo. Booking, checkout, gift certificates, quote forms, and enquiry forms are mocked for demonstration purposes. Cart state persists in `localStorage`.

Safety copy is intentionally included throughout the site: self-tan does not contain SPF and does not protect against UV exposure. Wear SPF daily.
