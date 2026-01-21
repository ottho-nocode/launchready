# LaunchReady

Generate all your App Store Connect assets in minutes, not hours.

## Features

- **Text Generation**: Automatically generate app name, subtitle, description, keywords, and promotional text
- **Mockup Generation**: Create professional mockups from your screenshots
- **One-Click Export**: Download all assets in a ready-to-upload ZIP file

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ottho-nocode/launchready.git
cd launchready
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-api-key-here
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4

## Project Structure

```
launchready/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── ui/              # Base UI components
│   └── layout/          # Layout components
├── lib/                  # Utility functions and services
├── store/               # Zustand state management
├── templates/           # Mockup templates
├── types/               # TypeScript type definitions
└── docs/                # Documentation
```

## License

MIT
