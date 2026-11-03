# Iontech × HP Sales Workspace: website files

These are the files for the Iontech HP pricelist and sales workspace: HP ZBook and Z workstations, business notebooks and thin clients, with prices, promos, HP Care Packs, an upgrade checker and quotations. They match the published version as of November 3, 2026.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | The finished page, a single self-contained file built from `source/`. This is the file that gets published. |
| `source/style.css` | All styling. Colors are tokens at the top, and dark mode is included. |
| `source/js/*.js` | The app code, joined in name order (see the module list below). |
| `source/build.py` | Rebuilds `index.html` from `source/`. Run `python3 source/build.py`. |
| `source/logos/` | The HP and Iontech logo files. The page itself uses copies embedded in `js/005-logos.js`. |
| `data/products.json` | All 181 products: specs, components, images, status and stock. |
| `data/prices.json` | Prices for every product: SRP, DP, on-hand, order basis, effective dates and approval. |
| `data/imagesets.json` | Image sets shared across the workstation and thin client series. |
| `data/seriesinfo.json` | Per-series features and selling points (HP Source Messaging). |
| `data/announcements.json` | Promos & news posts, including their poster images. |
| `images/` | Every product photo and promo poster used, named by the image id the data refers to. `_image-index.csv` lists which product, series or promo uses each image. |

## Important: where the page runs

The page is built for **Claude's published-page (Artifact) runtime**, which supplies:

- **sign-in**: who is viewing, and whether they are an admin (editor) or sales (contributor)
- **a shared database**: products, prices, promos, Care Packs, each user's private quotations, favorites and statistics
- **file storage**: product images and promo posters, served at `/_blob/<id>`
- **downloads**: Excel, PDF and CSV files
- **Claude features**: the Sales assistant and "Read with Claude" on the requirements page

If you upload `index.html` to an ordinary web host (Netlify, cPanel, GitHub Pages and the like), it will open on the "Sign in to use the sales workspace" screen. It needs those services to work.

To run it on another host, a developer would need to replace the data layer in `source/js/02-data.js`, which is where every database, sign-in, storage and download call starts. They'd connect it to a backend such as Firebase or Supabase, load `data/*.json` into it, and serve `images/` at `/_blob/<id>.jpg`. Everything else (the layout, catalog, filters, quotation builder, PDF and Excel generators, Care Packs and the upgrade checker) runs in the browser with no server.

## Rebuilding after a change

1. Edit a file in `source/`.
2. Run `python3 source/build.py`. It rewrites `index.html`.
3. Publish the new `index.html` to the same artifact link, and the data and images stay as they are.

## Code modules (`source/js`)

| File | Purpose |
|---|---|
| `005-logos.js` | Embedded HP and Iontech logos (web and PDF versions) |
| `01-core.js` | App state, icons, categories, statuses, price helpers, default settings (including the order-basis TAT) |
| `02-data.js` | Database, sign-in, storage and download connections; per-user state; statistics |
| `03-shell.js` | Header, category pills, quick filters, menu, routing, footer |
| `04-catalog.js` | Products page: landing hero, filters, product cards (grid and list), product detail page |
| `05-compare.js` | Compare 2–4 models |
| `06-match.js` | Client-brief requirements matcher |
| `07-quotes.js` | Quotations list and full editor |
| `071-qbuilder.js` | "Create quotation" window and the floating quote tray |
| `08-pdf.js` | PDF writer, co-branded letterhead and quotation PDF |
| `085-datasheet.js` | Components panel and data sheet PDF |
| `09-pages.js` | CSV export and the Sales assistant |
| `091-pricelist.js` | Price list page |
| `092-news.js` | Promos & news: posts, posters, PDF/JPEG downloads, promo tags |
| `093-upgrades.js`, `0935-hpdetails.js`, `094-upgview.js` | Workstation upgrade checker and item details |
| `095-stats.js` | Statistics page (admin) |
| `0965-carepacks-data.js` | HP Care Packs for the 65 business notebooks (HP Care Pack Central, Philippines, Oct 5, 2026) |
| `0966-carepacks.js` | Care Pack panel, picker and quotation lines |
| `0967-cpimport.js` | Admin → Care Packs importer and the HP Care Pack Central lookup |
| `10-xlsx.js`, `101-xlsxw.js` | Excel reader (imports) and writer (price list download) |
| `11-admin.js` | Admin: products, prices, import, images, Care Packs, promos, settings, buy costs, audit, export, access |
| `12-events.js` | Clicks, inputs and keyboard handling |

## Not included, on purpose

- **Buy costs**: they're restricted to admins and stay in the workspace's protected database.
- **Quotations, favorites and greeting names**: each person's own, private to them.
- **Statistics and the audit log.**
- **The HP source documents** used to write the specs and feature messages.
