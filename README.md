# Joseph Customer support

Customer-facing React frontend for the Joseph Customer support AI agent. The interface provides a polished support conversation, streamed agent progress, intent visibility, and guided clarification handling.

## Stack

- React 19, TypeScript, and Vite
- Tailwind CSS and shadcn-style UI components
- `@langchain/react` with the `useStream` hook
- LangGraph assistant: `agent`

The visible product name is **Joseph Customer support**. The LangGraph assistant ID remains `agent`, as defined by the backend `langgraph.json`.

## Frontend Setup

- Node.js 22+ and npm
- A running LangGraph server for the `agent` assistant

Install dependencies and start the frontend:

```bash
cd "C:\Users\USER\Desktop\my project\AI-Customer-support-agent-client"
npm install
npm run dev
```

The Vite development server will print the local frontend URL in the terminal.

Configure the LangGraph server URL in `.env`:

```env
VITE_LANGGRAPH_API_URL=http://localhost:2024
```

Restart Vite after changing environment variables.

The default backend integration expects the LangGraph server at `http://localhost:2024` with assistant ID `agent`. The frontend connects through `useStream` and does not call the NestJS REST endpoint directly.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create the production bundle. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format TypeScript and TSX files. |
| `npm run preview` | Preview the production build locally. |

## Frontend Structure

```text
src/
├── components/          Shared theme and UI components
├── features/agent/      Customer chat and LangGraph stream UI
├── lib/                 Shared utilities
├── App.tsx              Application entry view
└── main.tsx             React bootstrap
```

The agent page uses `useStream` for submission, streamed values, loading/error state, thread lifecycle, and interrupt responses. Keep graph-specific state types and customer-safe progress mapping close to `src/features/agent` so new agent nodes can be represented without coupling them to the application shell.

## Troubleshooting

- **Agent cannot be reached:** Confirm the configured LangGraph server is running and reachable at `VITE_LANGGRAPH_API_URL`.
- **Requests go to the wrong port:** Check `.env`; the URL should point to the LangGraph server, commonly `http://localhost:2024`.
- **Assistant not found:** Confirm the configured LangGraph server exposes assistant ID `agent`.
- **Environment changes have no effect:** Restart the Vite development server after editing `.env`.

Do not commit secrets or local `.env` files.
