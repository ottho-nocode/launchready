# Architecture - LaunchReady

**Version:** 1.0
**Date:** 2026-01-21
**PRD:** `docs/planning/prd/PRD-launchready.md`

---

## 1. Vue d'ensemble

### Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LAUNCHREADY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Next.js)                           │   │
│  │                                                                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │   Home     │  │  Generate  │  │  Preview   │  │   Export   │     │   │
│  │  │   Page     │  │   Page     │  │   Page     │  │   Modal    │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘     │   │
│  │         │              │              │               │             │   │
│  │  ┌──────┴──────────────┴──────────────┴───────────────┴──────────┐  │   │
│  │  │                    State Management (Zustand)                  │  │   │
│  │  │  - appDescription  - screenshots[]  - generatedTexts         │  │   │
│  │  │  - selectedTemplate  - mockupOptions  - exportSettings       │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       API ROUTES (Next.js)                           │   │
│  │                                                                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │   │
│  │  │ POST /api/      │  │ POST /api/      │  │ POST /api/      │      │   │
│  │  │ generate-texts  │  │ generate-mockup │  │ export          │      │   │
│  │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │   │
│  │           │                    │                    │               │   │
│  └───────────┼────────────────────┼────────────────────┼───────────────┘   │
│              │                    │                    │                   │
│              ▼                    ▼                    ▼                   │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐      │
│  │   OpenAI API      │  │   Image Service   │  │   Archive Service │      │
│  │   (GPT-4)         │  │   (Sharp/Canvas)  │  │   (Archiver)      │      │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                          ┌───────────────────┐
                          │     Vercel        │
                          │   (Deployment)    │
                          └───────────────────┘
```

---

## 2. Stack technique

### Frontend

| Technologie        | Version | Justification                             |
| ------------------ | ------- | ----------------------------------------- |
| **Next.js**        | 14.x    | App Router, Server Components, API Routes |
| **React**          | 18.x    | UI library standard                       |
| **TypeScript**     | 5.x     | Type safety, meilleure DX                 |
| **Tailwind CSS**   | 3.x     | Styling rapide, design system             |
| **shadcn/ui**      | latest  | Composants accessibles, customisables     |
| **Zustand**        | 4.x     | State management léger                    |
| **react-dropzone** | latest  | Upload drag & drop                        |
| **Framer Motion**  | latest  | Animations fluides                        |

### Backend

| Technologie            | Usage                 |
| ---------------------- | --------------------- |
| **Next.js API Routes** | Endpoints serverless  |
| **OpenAI SDK**         | Génération de textes  |
| **Sharp**              | Manipulation d'images |
| **node-canvas**        | Rendu mockups         |
| **Archiver**           | Génération ZIP        |

### Infrastructure

| Service         | Usage                          |
| --------------- | ------------------------------ |
| **Vercel**      | Hosting, CI/CD, Edge Functions |
| **Vercel Blob** | Stockage temporaire images     |

### Dev Tools

| Outil          | Usage      |
| -------------- | ---------- |
| **ESLint**     | Linting    |
| **Prettier**   | Formatting |
| **Vitest**     | Unit tests |
| **Playwright** | E2E tests  |

---

## 3. Structure du projet

```
launchready/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── generate/
│   │   └── page.tsx              # Main generation page
│   ├── api/
│   │   ├── generate-texts/
│   │   │   └── route.ts          # Text generation endpoint
│   │   ├── generate-mockup/
│   │   │   └── route.ts          # Mockup generation endpoint
│   │   └── export/
│   │       └── route.ts          # Export ZIP endpoint
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── container.tsx
│   ├── forms/
│   │   ├── description-form.tsx  # App description input
│   │   └── text-editor.tsx       # Generated text editor
│   ├── upload/
│   │   ├── dropzone.tsx          # Drag & drop zone
│   │   ├── screenshot-list.tsx   # Uploaded screenshots
│   │   └── screenshot-card.tsx   # Individual screenshot
│   ├── mockup/
│   │   ├── template-picker.tsx   # Template selection
│   │   ├── mockup-preview.tsx    # Single mockup preview
│   │   ├── mockup-gallery.tsx    # All mockups
│   │   └── options-panel.tsx     # Customization options
│   ├── preview/
│   │   ├── app-store-preview.tsx # Simulated App Store page
│   │   └── device-frame.tsx      # Device frame component
│   └── export/
│       ├── export-modal.tsx      # Export configuration
│       └── export-progress.tsx   # Download progress
│
├── lib/
│   ├── openai.ts                 # OpenAI client config
│   ├── image-processing.ts       # Sharp utilities
│   ├── mockup-renderer.ts        # Canvas mockup generation
│   ├── archive.ts                # ZIP generation
│   ├── prompts/
│   │   ├── app-name.ts           # Prompt for app name
│   │   ├── description.ts        # Prompt for description
│   │   └── keywords.ts           # Prompt for keywords
│   └── utils.ts                  # Shared utilities
│
├── store/
│   └── app-store.ts              # Zustand store
│
├── types/
│   ├── app.ts                    # App-wide types
│   ├── screenshot.ts             # Screenshot types
│   ├── mockup.ts                 # Mockup types
│   └── api.ts                    # API types
│
├── templates/
│   ├── device-frames/            # Device frame images
│   │   ├── iphone-14-pro-max-black.png
│   │   ├── iphone-14-pro-max-white.png
│   │   └── ...
│   └── backgrounds/              # Background presets
│       ├── gradients.json
│       └── colors.json
│
├── public/
│   ├── favicon.ico
│   └── og-image.png
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Flux de données

### 4.1 Génération de textes

```
┌────────┐    ┌───────────────┐    ┌────────────────┐    ┌────────────┐
│ User   │───▶│ Description   │───▶│ API Route      │───▶│ OpenAI     │
│ Input  │    │ Form          │    │ /generate-texts│    │ GPT-4      │
└────────┘    └───────────────┘    └────────────────┘    └────────────┘
                                           │
                                           ▼
┌────────┐    ┌───────────────┐    ┌────────────────┐
│ Store  │◀───│ Text Editor   │◀───│ Response       │
│ Update │    │ Components    │    │ (JSON)         │
└────────┘    └───────────────┘    └────────────────┘
```

**Payload request:**

```typescript
interface GenerateTextsRequest {
  description: string;
  language: 'fr' | 'en' | 'es' | 'de';
  category?: string;
}
```

**Payload response:**

```typescript
interface GenerateTextsResponse {
  appName: string; // max 30 chars
  subtitle: string; // max 30 chars
  promoText: string; // max 170 chars
  description: string; // max 4000 chars
  keywords: string; // max 100 chars
}
```

### 4.2 Upload et génération mockup

```
┌────────┐    ┌───────────────┐    ┌────────────────┐
│ User   │───▶│ Dropzone      │───▶│ Client-side    │
│ Drop   │    │ Component     │    │ Processing     │
└────────┘    └───────────────┘    └────────────────┘
                                           │
                                           ▼
                                   ┌────────────────┐
                                   │ Detect device  │
                                   │ Resize if need │
                                   │ Store in state │
                                   └────────────────┘
                                           │
                                           ▼
┌────────┐    ┌───────────────┐    ┌────────────────┐
│ Mockup │◀───│ API Route     │◀───│ Generate       │
│ Image  │    │ /gen-mockup   │    │ Request        │
└────────┘    └───────────────┘    └────────────────┘
```

**Payload request:**

```typescript
interface GenerateMockupRequest {
  screenshot: string; // Base64 image
  template: 'frame' | 'gradient' | 'text-overlay';
  options: {
    deviceColor: 'black' | 'white' | 'gold';
    backgroundColor?: string;
    headline?: string;
    fontFamily?: string;
  };
}
```

### 4.3 Export

```
┌────────┐    ┌───────────────┐    ┌────────────────┐
│ User   │───▶│ Export Modal  │───▶│ API Route      │
│ Click  │    │ Config        │    │ /export        │
└────────┘    └───────────────┘    └────────────────┘
                                           │
                                           ▼
                                   ┌────────────────┐
                                   │ Generate all   │
                                   │ mockups        │
                                   │ Create ZIP     │
                                   └────────────────┘
                                           │
                                           ▼
┌────────┐    ┌───────────────┐
│ User   │◀───│ Download      │
│ DL     │    │ ZIP file      │
└────────┘    └───────────────┘
```

---

## 5. Composants clés

### 5.1 Store (Zustand)

```typescript
// store/app-store.ts

interface Screenshot {
  id: string;
  file: File;
  preview: string;
  deviceType: DeviceType;
  mockupUrl?: string;
}

interface GeneratedTexts {
  appName: string;
  subtitle: string;
  promoText: string;
  description: string;
  keywords: string;
}

interface MockupOptions {
  template: 'frame' | 'gradient' | 'text-overlay';
  deviceColor: 'black' | 'white' | 'gold';
  backgroundColor: string;
  headline: string;
  fontFamily: string;
}

interface AppState {
  // Input
  appDescription: string;
  setAppDescription: (desc: string) => void;

  // Screenshots
  screenshots: Screenshot[];
  addScreenshots: (files: File[]) => void;
  removeScreenshot: (id: string) => void;
  reorderScreenshots: (from: number, to: number) => void;

  // Generated texts
  generatedTexts: GeneratedTexts | null;
  setGeneratedTexts: (texts: GeneratedTexts) => void;
  updateText: (key: keyof GeneratedTexts, value: string) => void;

  // Mockup options
  mockupOptions: MockupOptions;
  setMockupOptions: (options: Partial<MockupOptions>) => void;

  // UI state
  isGenerating: boolean;
  currentStep: 'input' | 'customize' | 'preview' | 'export';

  // Actions
  generateTexts: () => Promise<void>;
  generateMockups: () => Promise<void>;
  exportAssets: () => Promise<Blob>;
  reset: () => void;
}
```

### 5.2 API Routes

```typescript
// app/api/generate-texts/route.ts

export async function POST(request: Request) {
  const { description, language, category } = await request.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(description, language, category) },
    ],
    response_format: { type: 'json_object' },
  });

  return Response.json(JSON.parse(completion.choices[0].message.content));
}
```

```typescript
// app/api/generate-mockup/route.ts

export async function POST(request: Request) {
  const { screenshot, template, options } = await request.json();

  const buffer = Buffer.from(screenshot, 'base64');
  const mockup = await renderMockup(buffer, template, options);

  return new Response(mockup, {
    headers: { 'Content-Type': 'image/png' },
  });
}
```

### 5.3 Mockup Renderer

```typescript
// lib/mockup-renderer.ts

export async function renderMockup(
  screenshot: Buffer,
  template: Template,
  options: MockupOptions
): Promise<Buffer> {
  const canvas = createCanvas(1242, 2688);
  const ctx = canvas.getContext('2d');

  // 1. Draw background
  if (template === 'gradient') {
    drawGradient(ctx, options.backgroundColor);
  }

  // 2. Draw device frame
  const frame = await loadImage(`templates/device-frames/${options.deviceColor}.png`);
  ctx.drawImage(frame, 0, 0);

  // 3. Draw screenshot inside frame
  const screenshotImg = await loadImage(screenshot);
  ctx.drawImage(screenshotImg, FRAME_INSET_X, FRAME_INSET_Y, SCREEN_WIDTH, SCREEN_HEIGHT);

  // 4. Draw text overlay if needed
  if (template === 'text-overlay' && options.headline) {
    drawHeadline(ctx, options.headline, options.fontFamily);
  }

  return canvas.toBuffer('image/png');
}
```

---

## 6. Sécurité

### Mesures implémentées

| Mesure             | Implémentation                     |
| ------------------ | ---------------------------------- |
| Rate limiting      | Vercel Edge config (10 req/min/IP) |
| Input validation   | Zod schemas sur toutes les routes  |
| File validation    | Type MIME + magic bytes check      |
| Max file size      | 10MB par image                     |
| CORS               | Origine restreinte en prod         |
| API key protection | Env vars côté serveur uniquement   |

### Validation des uploads

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

function validateFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) return false;
  if (!ALLOWED_TYPES.includes(file.type)) return false;
  return true;
}
```

---

## 7. Performance

### Optimisations

| Technique                | Bénéfice              |
| ------------------------ | --------------------- |
| Image compression client | Réduit payload upload |
| Lazy loading composants  | Faster initial load   |
| Server Components        | Moins de JS client    |
| Edge Functions           | Latence réduite       |
| Response streaming       | UX génération texte   |

### Caching

- Pas de cache côté serveur (données éphémères)
- Cache navigateur pour assets statiques (device frames)
- Cache OpenAI responses désactivé (unicité requise)

---

## 8. Monitoring & Observabilité

### Services

| Service                | Usage                |
| ---------------------- | -------------------- |
| Vercel Analytics       | Trafic, performances |
| Sentry                 | Error tracking       |
| OpenAI usage dashboard | Coûts API            |

### Métriques clés

- Temps de génération texte (p50, p95)
- Temps de génération mockup (p50, p95)
- Taux d'erreur par endpoint
- Coût OpenAI par jour

---

## 9. Déploiement

### Environnements

| Env         | URL             | Usage       |
| ----------- | --------------- | ----------- |
| Development | localhost:3000  | Dev local   |
| Preview     | \*.vercel.app   | PR previews |
| Production  | launchready.app | Prod        |

### Variables d'environnement

```env
# .env.example

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://launchready.app

# Vercel (auto-set)
VERCEL_ENV=production
```

### CI/CD Pipeline

```yaml
# Vercel auto-deploy on push

main branch → Production
PR branches → Preview deployments

Pre-deploy checks:
- TypeScript compilation
- ESLint
- Unit tests
- E2E tests (Playwright)
```

---

## 10. ADRs (Architecture Decision Records)

### ADR-001: Next.js over Remix/SvelteKit

**Contexte:** Choix du framework frontend/fullstack.

**Décision:** Next.js 14 avec App Router.

**Raisons:**

- Écosystème mature et documentation
- Server Components pour optimisation
- Intégration native Vercel
- shadcn/ui conçu pour Next.js

### ADR-002: Zustand over Redux/Jotai

**Contexte:** State management pour l'app.

**Décision:** Zustand.

**Raisons:**

- API simple et légère
- Pas de boilerplate
- TypeScript-first
- Sufficient pour ce scope

### ADR-003: Sharp + node-canvas over alternatives

**Contexte:** Manipulation d'images côté serveur.

**Décision:** Sharp pour processing, node-canvas pour rendering.

**Raisons:**

- Sharp: Performance native (libvips)
- node-canvas: API Canvas familière
- Alternatives (Jimp, Konva) moins performantes

### ADR-004: Serverless over persistent server

**Contexte:** Architecture backend.

**Décision:** API Routes serverless (Vercel Functions).

**Raisons:**

- Pas d'état à maintenir
- Scale automatique
- Coût optimisé (pay-per-use)
- Maintenance minimale

---

## Checklist Architecture

| Critère                    | Status |
| -------------------------- | ------ |
| Stack défini et justifié   | ✅     |
| Structure projet claire    | ✅     |
| Flux de données documentés | ✅     |
| Composants clés spécifiés  | ✅     |
| Sécurité adressée          | ✅     |
| Performance considérée     | ✅     |

**Score : 6/6** → Prêt pour Stories

---

_Généré automatiquement - RALPH Mode_
