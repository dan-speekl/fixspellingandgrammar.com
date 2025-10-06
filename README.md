# Fix Spelling and Grammar

A professional, LLM-powered grammar and spelling correction tool. Simple, fast, and distraction-free.

## What It Does

Paste or type your text, and LLM instantly corrects:

- Spelling mistakes
- Grammar errors
- Punctuation issues
- Sentence clarity and structure

Get corrected text with a brief explanation of changes made.

## Tech Stack

- **Frontend**: React + TanStack Router + TanStack Start
- **Styling**: Tailwind CSS + Shadcn UI
- **AI**: Vercel AI SDK with OpenAI GPT-5
- **Animations**: Motion (Framer Motion)
- **Validation**: Zod schemas
- **Linting**: Biome

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Preview production build
pnpm lint         # Run linter
pnpm format       # Format code
pnpm check        # Lint + format check
```

## Environment Setup

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Features

- **Clean UI**: Minimalist design focused on the task
- **Real-time Streaming**: See corrections as they're generated
- **Copy to Clipboard**: One-click copy with visual feedback
- **Detailed Explanations**: Understand what was changed and why
- **Responsive**: Works seamlessly on all devices
- **Dark Mode Support**: Adapts to system preferences

## How It Works

1. User enters text in the input field
2. Text is sent to `/api/fix` endpoint
3. An LLM processes and corrects the text
4. Response streams back in real-time
5. Corrected text and explanation are displayed
6. User can copy the result with one click

## Credits

Built by [Dan Zabrotski](https://danzabrotski.com/)

## License

MIT
