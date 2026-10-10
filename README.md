# Joseph Customer support

Customer-facing React frontend for the Joseph Customer support AI agent. The interface uses LangGraph execution to stream agent state, show customer-safe execution progress, and handle clarification or email interrupts in the same conversation.

## Stack

- React 19, TypeScript, and Vite
- Tailwind CSS and shadcn-style UI components
- `@langchain/react` with the `useStream` hook
- LangGraph assistant: `agent`

The visible product name is **Joseph Customer support**. The LangGraph assistant ID remains `agent`, as defined by the backend `langgraph.json`.

## Prerequisites

- Node.js 22+ and npm
- The backend repository at `C:\Users\USER\Desktop\my project\customer-support-agent`
- Backend environment variables configured according to the backend README

The frontend connects directly to the LangGraph server. It does not use the NestJS `POST /agent/question` endpoint because `useStream` requires the LangGraph streaming protocol.

## Local Development

Start the LangGraph server from the backend repository:

```bash
cd "C:\Users\USER\Desktop\my project\customer-support-agent"
npx @langchain/langgraph-cli dev
```

The LangGraph server should be available at `http://localhost:2024` and expose the `agent` graph.

In a second terminal, install and start the frontend:

```bash
cd "C:\Users\USER\Desktop\my project\AI-Customer-support-agent-client"
npm install
npm run dev
```

If the LangGraph server uses a different URL, create or update `.env` in this repository:

```env
VITE_LANGGRAPH_API_URL=http://localhost:2024
```

Restart Vite after changing environment variables.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create the production bundle. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format TypeScript and TSX files. |
| `npm run preview` | Preview the production build locally. |

## Project Structure

```text
src/
├── components/          Shared theme and UI components
├── features/agent/      Customer chat and LangGraph stream UI
├── lib/                 Shared utilities
├── App.tsx              Application entry view
└── main.tsx             React bootstrap
```

The agent page uses `useStream` for submission, streamed values, loading/error state, thread lifecycle, and interrupt responses. Keep graph-specific state types and customer-safe progress mapping close to the agent feature so new backend nodes can be added without coupling them to the overall application shell.

## Troubleshooting

- **Agent cannot be reached:** Confirm a process is listening on port `2024` and that `npx @langchain/langgraph-cli dev` is running.
- **Requests go to port 8000:** Check `.env`; `VITE_LANGGRAPH_API_URL` must point to the LangGraph server, not the NestJS API.
- **Assistant not found:** Confirm the backend `langgraph.json` contains the `agent` graph entry.
- **Environment changes have no effect:** Restart the Vite development server after editing `.env`.

Do not commit secrets or local `.env` files.
