# RLEcommernce E-commerce (DummyJSON)

This project is a lightweight e‑commerce front‑end for RLEcommernce that fetches product data from the DummyJSON API and implements a basic cart using React Context and localStorage persistence.

## Features

- Home page with product listings
- Product details pages (dynamic route)
- Cart page with add / remove functionality
 - Wishlist with add / remove functionality (love button)
- Cart persisted to localStorage for the session

## How to run (local)

1. Navigate into the folder

```bash
cd nextjs-ecommerce
```

2. Install dependencies (recommended: Node >= 18)

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Design choices & trade-offs

- Data Fetching: Used getServerSideProps for the listing and detail pages to keep initial load SEO-friendly and simple; client-side fetching calls would also be valid.
- State management: Cart is implemented with React Context using localStorage to persist state between reloads. This is lightweight and sufficient for single-tab/basic apps. For more advanced use cases (multi-tab sync, concurrent updates) a library like Zustand (with session sync) or Redux would be recommended.
	- Wishlist: wishlist state is implemented in the same Context and persisted to localStorage. A 'love' button on products and product detail pages toggles wishlist membership.
		- Wishlist: wishlist state is implemented in the same Context and persisted to localStorage. A 'love' button on products, product detail pages, and cart items toggles wishlist membership — cart items remain in the cart when toggled unless explicitly removed by the user.
		- UI Feedback: a lightweight toast notification shows when items are added to cart, with an optional undo action. This is implemented with a ToastContext and small `Toasts` component.
- Styling: CSS modules are used for components for isolation and simplicity.

## Known limitations
- No pagination: the app fetches the default set of DummyJSON products.
- No server-side cart operations (everything is client-side only).
- No authentication or checkout flow (focused on frontend architecture).
