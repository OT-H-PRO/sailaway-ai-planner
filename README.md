# Sail Away

**Plan beautifully. Sail smoothly.**

Sail Away is a modern, AI-powered event planning concierge built with a luxurious dark-mode aesthetic. It helps event planners, hosts, and coordinators craft elegant communications, build structured task timelines, and get real-time guidance from an intelligent chat assistant.

---

## Features

| Tool | What it does |
|------|-------------|
| **Email Generator** | Compose polished, tone-aware emails for guests, vendors, and VIPs. Choose from Formal, Warm, Elegant, Casual, Urgent, or Appreciative tones. |
| **Task Planner** | Generate phase-based event timelines with progress tracking. From pre-event preparation to day-of logistics and post-event wrap-up. |
| **Concierge Chat** | Ask anything event-related in a streaming, real-time conversation. Get instant guidance on venues, timelines, vendors, and logistics. |

---

## Design

- **Theme:** Dark + gold accents (midnight navy, glassmorphism, warm gold highlights)
- **Typography:** Clean, editorial feel with generous whitespace
- **Motion:** Smooth Framer Motion transitions for tab switching and message streaming
- **Mood:** Premium, calm, confident — like a private concierge service

---

## Tech Stack

- **Framework:** TanStack Start v1 (React 19, SSR/SSG, Vite 7)
- **Styling:** Tailwind CSS v4 with custom OKLCH design tokens
- **Animations:** Framer Motion
- **AI:** Lovable AI Gateway (streaming chat + server functions)
- **Icons:** Lucide React
- **UI Components:** shadcn/ui

---

## Project Structure

```
src/
  components/
    Chatbot.tsx          # Streaming concierge chat
    EmailGenerator.tsx   # AI email composer UI
    TaskPlanner.tsx      # Phase-based timeline UI
  lib/
    ai-gateway.server.ts # Lovable AI Gateway provider
    email.functions.ts   # Server function: generateEmail
    task-planner.functions.ts # Server function: generateTasks
  routes/
    api/chat.ts          # Streaming chat API endpoint
    index.tsx            # Dashboard (tabbed interface)
    __root.tsx           # Root layout
  styles.css             # Custom dark-gold theme tokens
```

---

## Getting Started

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

No manual configuration is required. The app uses the built-in Lovable AI Gateway for all AI-powered features.

---

## License

MIT
