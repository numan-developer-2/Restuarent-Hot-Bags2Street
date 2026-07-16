# Hot Bagels 2nd Street Ordering

Premium Next.js ordering experience for Hot Bagels 2nd Street. The app converts the original single-file prototype into a maintainable frontend with menu browsing, item customization, cart flow, checkout demo, and a future-ready Gohlem.ai ordering brain handoff.

## Project Scope

- Customer-facing ordering website for Hot Bagels 2nd Street
- Real menu data from `data/hot_bagels_menu.json`
- Searchable menu with category scrolling
- Product customization drawer with required modifier validation
- Cart drawer with quantity/remove controls
- Demo checkout form and order summary
- Floating AI assistant preview shell
- `/brain` harness and `/api/assistant` route for the future ordering brain

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Static JSON menu data

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Brain harness:

```text
http://localhost:3000/brain
```

## Quality Checks

Run these before pushing or deploying:

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel Deployment

If importing a parent repository into Vercel, set:

```text
Root Directory: ProjectWorking
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
```

If this folder itself is the repository root, leave Vercel root directory as default.

## Environment Variables

For local AI ordering brain integration:

```bash
HOT_BAGELS_BRAIN_URL=http://127.0.0.1:8000
HOT_BAGELS_BRAIN_TIMEOUT_MS=180000
```

Run the Python backend separately:

```bash
cd ../BackendWorking/hot-bagels-brain
.\.venv\Scripts\activate
uvicorn api.main:app --reload --port 8000
```

The floating assistant calls the Next.js `/api/assistant` route, which proxies to the Python backend `/api/chat`.

## Repository Hygiene

Commit only production/source files:

- `app/`
- `components/`
- `data/`
- `lib/`
- `public/`
- `store/`
- `types/`
- config files such as `package.json`, `package-lock.json`, `next.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- `README.md`

Do not commit generated or planning files:

- `node_modules/`
- `.next/`
- `*.log`
- `tsconfig.tsbuildinfo`
- original single-file HTML prototype
- master prompts
- PDF requirement documents
- local analysis/checklist notes

## Project Name

Client-facing name:

```text
Hot Bagels 2nd Street
```

Recommended repo/deployment slug:

```text
hot-bagels-2nd-street-ordering
```
