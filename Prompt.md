Build Prompt: Lebanese Multi-Vendor Marketplace (Amazon-style)
Copy everything below the line into Claude Code (or any coding assistant) to start building.
ROLE
You are a senior full-stack engineer. Build a production-ready multi-vendor e-commerce marketplace for Lebanon, where businesses create seller accounts, customize their branded storefront, list products, and the platform earns commission and subscription fees.
HOSTING CONSTRAINTS (Hostinger Cloud Startup)
Shared-style PHP/MySQL environment with SSH, Composer, cron jobs, and hPanel. No long-running Node.js server, no Docker, no Redis/Supervisor.
Therefore: use PHP + MySQL. Build front-end assets locally (npm run build) and commit/upload the compiled public/build. Use the database queue driver processed by a cron job (php artisan schedule:run every minute). Use file/database cache.
Provide a step-by-step Hostinger deployment guide (document root pointing to /public, .env, storage:link, migrations, cron setup, PHP version, SSL, backups).
TECH STACK
Laravel (latest stable), MySQL, Blade + Livewire, Tailwind CSS
Filament for the Admin panel
Spatie packages: laravel-permission (roles), laravel-medialibrary (images), laravel-translatable (AR/EN content)
Laravel Sanctum only if an API is needed later
LANGUAGES & CURRENCY
Arabic (full RTL) and English (LTR), switchable, with the choice remembered per user. All UI strings in lang files; product/store/category content translatable per language.
Multi-currency: prices stored in USD and/or LBP. Sellers set the price currency per product. Admin sets and updates the exchange rate. Show customers a currency toggle. Never use floats for money (use integer minor units or DECIMAL).
USER ROLES
Customer: browse, search, cart, checkout, orders, reviews, wishlist, addresses.
Seller (vendor): registers, awaits admin approval, manages store, products, orders, earnings, payouts.
Admin: full control through the Filament panel.
Optional Courier role later (not in MVP).
MVP FEATURES
Customer side
Home page, category tree, product listing with filters (category, price, seller, rating, in stock) and sorting
Search with suggestions (MySQL FULLTEXT; Arabic-friendly)
Product page: gallery, variants (size/color), stock, seller info, reviews
Cart (guest and logged in), multi-seller cart split into sub-orders per seller
Checkout with Lebanese addresses (governorate → district → town), phone number required
Order tracking and history; order status emails/notifications
Reviews and ratings for products and sellers (only verified buyers)
Wishlist, coupon codes at checkout
Seller side (dashboard)
Registration with business info (name, commercial registration/ID upload, phone, address, bank/Whish/OMT payout details); status: pending → approved/rejected/suspended
Branded storefront at /store/{slug}: logo, banner, brand colors, about section, configurable sections (featured products, categories, announcements), social links, contact info. (Subdomains are out of scope.)
Product management: create/edit/delete, multiple images, variants, stock, SKU, bulk CSV import/export, draft/published
Order management: view sub-orders, change status (confirmed, packed, shipped, delivered, cancelled), print packing slip/invoice
Delivery settings: choose self-delivery (own fees per zone) or platform courier
Earnings page: sales, commission deducted, subscription status, pending/available balance, payout requests and history
Seller-created coupons and promotions for their own products
Respond to reviews
Admin panel
Approve/reject/suspend sellers; impersonate seller for support
Manage categories (nested), attributes, brands
Commission engine, applied in this priority: per-seller custom % → per-category % → global default %. Store the commission rate used on each order item at purchase time so later changes don't alter history.
Subscription plans for sellers (e.g., Free / Basic / Pro) with monthly fee, product limit, and feature flags; track subscription status, due dates, and suspend or restrict on non-payment
Orders overview, refunds/cancellations, dispute notes
Payout management: review requests, mark as paid with reference
Platform-wide coupons and promotions
Review moderation
Delivery zones and platform-courier fees by zone
Settings: exchange rate, default commission, tax, site info, SEO, banners
Reports: GMV, commission earned, subscription revenue, top sellers/products (exportable)
PAYMENTS
Build a payment-gateway adapter interface so methods can be added without refactoring:
Cash on Delivery: with optional COD fee; collected amount tracked per order; seller or courier marks as collected.
Whish Money / OMT: start with a manual confirmation flow (customer sees instructions and uploads/enters the transfer reference; admin or seller verifies). Leave a clean adapter ready for a real API if available.
Credit/debit card: implement as an adapter with a sandbox/mock driver. Note in the README that I must confirm which gateway/bank in Lebanon will be used and plug in its credentials.
Payment status per order and per sub-order; record every transaction in a ledger.
FINANCIAL LEDGER (important)
Double-entry-style ledger: order paid → seller gross, platform commission, delivery fee, COD collected. Seller balance = earnings − commission − refunds − payouts.
Funds become "available" only after order is delivered plus a configurable hold period.
All money operations in DB transactions, with audit logs.
DELIVERY
Per-seller choice: self-delivery or platform courier.
Zone-based delivery fees (by governorate/district), set by seller (self-delivery) or admin (platform courier).
Delivery status updates and customer notifications. Platform courier: admin assigns orders and enters courier/tracking info (courier app is out of scope).
NON-FUNCTIONAL REQUIREMENTS
Security: policies/authorization on every seller resource (a seller can only touch their own data), CSRF, validation, rate limiting on login/checkout, secure file uploads (type/size checks, image resizing), hashed passwords, optional 2FA for admin.
Performance: eager loading, pagination, image optimization (WebP, lazy loading), caching of categories/settings.
SEO: clean slugs, meta tags, Open Graph, sitemap.xml, structured data (Product, Breadcrumb).
Mobile-first responsive design (most Lebanese users shop on phones). Consider PWA basics.
Notifications: email + database notifications; WhatsApp deep-link buttons ("contact seller", "share order") rather than a paid API.
Legal pages: Terms, Privacy, Return policy, Seller agreement (placeholders).
Backups & logging: scheduled DB backup command, error logging.
DELIVERABLES (build in this order, confirming after each phase)
Project setup, folder structure, DB schema (ERD + migrations), seeders (Lebanese governorates/districts, demo data), RTL/i18n scaffold
Auth + roles + seller registration/approval
Catalog: categories, products, variants, media, search
Seller dashboard and branded storefront
Cart, checkout, sub-orders, payment adapters, COD and manual Whish/OMT
Commission engine, subscriptions, ledger, payouts
Delivery zones and order lifecycle + notifications
Reviews, coupons, wishlist
Admin panel reports and settings
Testing (feature tests for commission, ledger, authorization, checkout), README, Hostinger deployment guide
WORKING RULES
Before coding each phase, state the plan briefly, then implement.
Write clean, commented, PSR-12 code with tests for money and permission logic.
Don't invent integrations: where something requires my external credentials or a decision (card gateway, courier, SMS), stub it behind an interface and list it under "Needs my input".
At the end of each phase, give me: what was built, how to run/test it, and what's next.
Ask me before making major architectural changes.
OUT OF SCOPE FOR MVP
Mobile apps, seller subdomains, courier mobile app, live chat, AI recommendations, multi-warehouse inventory, international shipping.
Build Prompt: Lebanese Multi-Vendor Marketplace (Amazon-style)
Copy everything below the line into Claude Code (or any coding assistant) to start building.
ROLE
You are a senior full-stack engineer. Build a production-ready multi-vendor e-commerce marketplace for Lebanon, where businesses create seller accounts, customize their branded storefront, list products, and the platform earns commission and subscription fees.
HOSTING CONSTRAINTS (Hostinger Cloud Startup)
Shared-style PHP/MySQL environment with SSH, Composer, cron jobs, and hPanel. No long-running Node.js server, no Docker, no Redis/Supervisor.
Therefore: use PHP + MySQL. Build front-end assets locally (npm run build) and commit/upload the compiled public/build. Use the database queue driver processed by a cron job (php artisan schedule:run every minute). Use file/database cache.
Provide a step-by-step Hostinger deployment guide (document root pointing to /public, .env, storage:link, migrations, cron setup, PHP version, SSL, backups).
TECH STACK
Laravel (latest stable), MySQL, Blade + Livewire, Tailwind CSS
Filament for the Admin panel
Spatie packages: laravel-permission (roles), laravel-medialibrary (images), laravel-translatable (AR/EN content)
Laravel Sanctum only if an API is needed later
LANGUAGES & CURRENCY
Arabic (full RTL) and English (LTR), switchable, with the choice remembered per user. All UI strings in lang files; product/store/category content translatable per language.
Multi-currency: prices stored in USD and/or LBP. Sellers set the price currency per product. Admin sets and updates the exchange rate. Show customers a currency toggle. Never use floats for money (use integer minor units or DECIMAL).
DESIGN SYSTEM, UI AND UX (follow strictly)
Concept: "Hairline Grid"
A modern, editorial, dark-first design. The reference is a charcoal page divided into cells by 1px hairline lines (a bento grid drawn with thin borders), with wide-spaced uppercase condensed headlines, short dash accents under headings, small circular "stamp" badges, and plain underlined links. Reference site for the feel and motion: https://longstoryshortdesign.co.uk/ (study its layout rhythm, pacing and transitions when you can open it; if the animations can't be inspected, implement the motion spec below instead and tell me).
Layout
Bento hairline grid for the homepage, category pages and seller storefronts: modular cells of different sizes separated by 1px lines (gap:1px over a line-colored background, or borders). No heavy shadows, no rounded-card clutter. Corner radius 0-4px.
Homepage order: announcement bar → header (logo cell + utility row + main nav) → hero statement → bento of featured product, trust cell, delivery cell → category cells (Fashion, Electronics, Mobiles, Home gadgets) → deals → top sellers → newsletter → footer grid.
Product listing: dense, scannable grid (no anti-grid or experimental layouts here). Sticky filter bar, quick-view, wishlist heart.
Product page: gallery with zoom; 3D/AR viewer only where a seller uploads a model (lazy-loaded, with a fast image fallback); spec table as real HTML text; seller cell with rating and "verified" stamp; sticky add-to-cart bar on mobile.
App-like mobile experience: bottom navigation (Home, Categories, Search, Cart, Account), swipe gestures on galleries, slide-in mini-cart drawer, thumb-reach controls, install-to-home-screen (PWA).
Natural-language search box ("black sneakers size 42 under $60") that maps to filters server-side; always fall back to normal search.
Typography
Headlines: condensed uppercase display font with wide letter-spacing (e.g. Barlow Condensed or Oswald; for Arabic use a matching condensed/modern Arabic face such as IBM Plex Sans Arabic, Cairo or Readex Pro, do not letter-space Arabic). Body: Barlow / Inter and the Arabic equivalent.
Self-host fonts (no render-blocking third-party requests), font-display: swap, subset Arabic + Latin.
Short 20-24px dash under section headings as a signature element.
Underlined text links with a colored underline that animates on hover; avoid heavy filled buttons except the one main CTA per view.
Color tokens (dark default + light mode, user-toggle, remember choice)
Define as CSS variables / Tailwind theme tokens:
Token	Dark	Light	Use
--ink	#17181B	#F3EFE8	page background
--graphite	#222428	#FFFFFF	cells, cards
--line	#3A3D44	#D9D4CB	hairlines
--bone	#F3EFE8	#17181B	main text
--muted	#A9ABB2	#5B5E66	secondary text
--ember	#FF5A44	#E8452F	main CTA, stamps, active states
--cedar	#2FBF8F	#1E9A72	success, verified seller, in stock, delivered
--gold	#E8B84A	#B8860B	ratings, deals
--sand	#D9C3A5	#8A6F4B	Fashion department tint
--cyan	#4DD4E6	#0E8FA3	Electronics and Mobiles tint
--sage	#9BC995	#4F7F4A	Home gadgets tint
Use ember sparingly (one primary CTA per view). Department tints appear only on that department's icons, hover lines and stamps.
Validate contrast: all text at least 4.5:1 (3:1 for large text and UI lines); add an automated contrast check in the tests or build step. Never rely on color alone for status (add icon or label).
Each seller may pick from 4-5 approved storefront color themes (never free-form colors that break contrast).
Motion spec (subtle, fast, purposeful)
Hairline draw-in: grid lines draw/extend as sections enter the viewport (CSS clip-path or scaleX/scaleY transitions, IntersectionObserver).
Staggered cell reveal: cells fade + translate up 12-16px with 60-80ms stagger; 400-600ms, ease-out.
Heading dash stretches in after the heading appears; underline links animate from the left (from the right in RTL).
Hover: product image lifts/zooms ~1.03, hairline brightens to the accent; stamp badges rotate slightly.
Add to cart: button micro-feedback, cart icon bump, mini-cart drawer slides in.
Page transitions: quick fade (≤200ms); skeleton loaders (hairline-style) instead of spinners.
Optional scrollytelling only on the homepage hero and seller storefront headers; never on product listings or checkout.
Respect prefers-reduced-motion (disable all of the above), keep animations on transform/opacity only, and use Alpine.js/vanilla JS or Livewire transitions with CSS; avoid heavy animation libraries (if one is needed, GSAP loaded only on pages that use it).
Per-department personality (same system, different mood)
Fashion: editorial, large lifestyle imagery, serif accent headlines, sand tint, "shop the look" shoppable collages, size guide.
Electronics and Mobiles: darkest theme, cyan tint, spec comparison table, 3D view, storage/color pickers, warranty stamp.
Home gadgets: friendlier, sage tint, short product demo video, "how it works" cell.
Arabic-first and RTL
Design Arabic as a first-class layout, not a mirrored afterthought: logical CSS properties (margin-inline, padding-inline), mirrored icons/arrows/animation directions, Arabic numerals option, proper Arabic typography and line-height.
Language switcher in the utility row; remember choice; separate SEO URLs per language (/ar/..., /en/...) with hreflang.
Performance and accessibility budget (Hostinger Cloud, mid-range phones on 4G)
Target Lighthouse mobile ≥ 85 performance, ≥ 95 accessibility. LCP < 2.5s.
WebP/AVIF images with responsive srcset, lazy loading, explicit dimensions; critical CSS inline; no layout shift; defer all offscreen JS; cache static assets; Gzip/Brotli via .htaccess.
WCAG 2.2 AA: keyboard navigation, visible focus ring (ember), skip-to-content link, semantic HTML, labelled forms, alt text, ARIA only where needed.
Machine-readable product data: semantic HTML, JSON-LD (Product, Offer, AggregateRating, Breadcrumb), real text specs (not images).
Deliver a DESIGN.md documenting tokens, components, spacing scale (4/8px), motion rules, and Arabic typography, plus a /styleguide page showing every component in dark/light and LTR/RTL.
Reusable component library (Blade/Livewire)
Header, announcement bar, bento cell, stamp badge, product card, price (USD/LBP toggle), rating, seller badge, filter drawer, mini-cart, quantity stepper, size/color picker, spec table, review block, toast, skeleton, empty state, bottom nav, form fields with inline validation, dashboard tables and stat cells for seller/admin panels.
USER ROLES
Customer: browse, search, cart, checkout, orders, reviews, wishlist, addresses.
Seller (vendor): registers, awaits admin approval, manages store, products, orders, earnings, payouts.
Admin: full control through the Filament panel.
Optional Courier role later (not in MVP).
MVP FEATURES
Customer side
Home page, category tree, product listing with filters (category, price, seller, rating, in stock) and sorting
Search with suggestions (MySQL FULLTEXT; Arabic-friendly)
Product page: gallery, variants (size/color), stock, seller info, reviews
Cart (guest and logged in), multi-seller cart split into sub-orders per seller
Checkout with Lebanese addresses (governorate → district → town), phone number required
Order tracking and history; order status emails/notifications
Reviews and ratings for products and sellers (only verified buyers)
Wishlist, coupon codes at checkout
Seller side (dashboard)
Registration with business info (name, commercial registration/ID upload, phone, address, bank/Whish/OMT payout details); status: pending → approved/rejected/suspended
Branded storefront at /store/{slug}: logo, banner, brand colors, about section, configurable sections (featured products, categories, announcements), social links, contact info. (Subdomains are out of scope.)
Product management: create/edit/delete, multiple images, variants, stock, SKU, bulk CSV import/export, draft/published
Order management: view sub-orders, change status (confirmed, packed, shipped, delivered, cancelled), print packing slip/invoice
Delivery settings: choose self-delivery (own fees per zone) or platform courier
Earnings page: sales, commission deducted, subscription status, pending/available balance, payout requests and history
Seller-created coupons and promotions for their own products
Respond to reviews
Admin panel
Approve/reject/suspend sellers; impersonate seller for support
Manage categories (nested), attributes, brands
Commission engine, applied in this priority: per-seller custom % → per-category % → global default %. Store the commission rate used on each order item at purchase time so later changes don't alter history.
Subscription plans for sellers (e.g., Free / Basic / Pro) with monthly fee, product limit, and feature flags; track subscription status, due dates, and suspend or restrict on non-payment
Orders overview, refunds/cancellations, dispute notes
Payout management: review requests, mark as paid with reference
Platform-wide coupons and promotions
Review moderation
Delivery zones and platform-courier fees by zone
Settings: exchange rate, default commission, tax, site info, SEO, banners
Reports: GMV, commission earned, subscription revenue, top sellers/products (exportable)
PAYMENTS
Build a payment-gateway adapter interface so methods can be added without refactoring:
Cash on Delivery: with optional COD fee; collected amount tracked per order; seller or courier marks as collected.
Whish Money / OMT: start with a manual confirmation flow (customer sees instructions and uploads/enters the transfer reference; admin or seller verifies). Leave a clean adapter ready for a real API if available.
Credit/debit card: implement as an adapter with a sandbox/mock driver. Note in the README that I must confirm which gateway/bank in Lebanon will be used and plug in its credentials.
Payment status per order and per sub-order; record every transaction in a ledger.
FINANCIAL LEDGER (important)
Double-entry-style ledger: order paid → seller gross, platform commission, delivery fee, COD collected. Seller balance = earnings − commission − refunds − payouts.
Funds become "available" only after order is delivered plus a configurable hold period.
All money operations in DB transactions, with audit logs.
DELIVERY
Per-seller choice: self-delivery or platform courier.
Zone-based delivery fees (by governorate/district), set by seller (self-delivery) or admin (platform courier).
Delivery status updates and customer notifications. Platform courier: admin assigns orders and enters courier/tracking info (courier app is out of scope).
NON-FUNCTIONAL REQUIREMENTS
Security: policies/authorization on every seller resource (a seller can only touch their own data), CSRF, validation, rate limiting on login/checkout, secure file uploads (type/size checks, image resizing), hashed passwords, optional 2FA for admin.
Performance: eager loading, pagination, image optimization (WebP, lazy loading), caching of categories/settings.
SEO: clean slugs, meta tags, Open Graph, sitemap.xml, structured data (Product, Breadcrumb).
Mobile-first responsive design (most Lebanese users shop on phones). Consider PWA basics.
Notifications: email + database notifications; WhatsApp deep-link buttons ("contact seller", "share order") rather than a paid API.
Legal pages: Terms, Privacy, Return policy, Seller agreement (placeholders).
Backups & logging: scheduled DB backup command, error logging.
DELIVERABLES (build in this order, confirming after each phase)
Design foundation first: design tokens, dark/light and LTR/RTL setup, fonts, the component library, /styleguide page and DESIGN.md, the motion utilities, and a static homepage following the Hairline Grid concept. Show it to me for approval before building features.
Project setup, folder structure, DB schema (ERD + migrations), seeders (Lebanese governorates/districts, demo data), RTL/i18n scaffold
Auth + roles + seller registration/approval
Catalog: categories, products, variants, media, search
Seller dashboard and branded storefront
Cart, checkout, sub-orders, payment adapters, COD and manual Whish/OMT
Commission engine, subscriptions, ledger, payouts
Delivery zones and order lifecycle + notifications
Reviews, coupons, wishlist
Admin panel reports and settings
Testing (feature tests for commission, ledger, authorization, checkout), README, Hostinger deployment guide
WORKING RULES
Before coding each phase, state the plan briefly, then implement.
Write clean, commented, PSR-12 code with tests for money and permission logic.
Don't invent integrations: where something requires my external credentials or a decision (card gateway, courier, SMS), stub it behind an interface and list it under "Needs my input".
At the end of each phase, give me: what was built, how to run/test it, and what's next.
Ask me before making major architectural changes.
OUT OF SCOPE FOR MVP
Heavy 3D/animation on listing or checkout pages, mobile apps, seller subdomains, courier mobile app, live chat, AI recommendations, multi-warehouse inventory, international shipping.