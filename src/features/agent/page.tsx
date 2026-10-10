import { type FormEvent, type ReactNode, useRef, useState } from "react"
import { useStream } from "@langchain/react"
import {
  Activity,
  AlertCircle,
  ArrowUp,
  Bot,
  Check,
  CircleHelp,
  Copy,
  GitBranch,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Moon,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SupportState = {
  customerQuestion?: string
  customerMail?: string
  intent?: string
  confidence?: number
  needsClarification?: boolean
  missingInformation?: string[]
  response?: string
}
type SupportInterrupt = { reason?: string; missingInformation?: string[] }
type Message = { id: string; role: "user" | "assistant"; content: string }
type TraceItem = { node: string; label: string; complete: boolean }
const intents: Record<string, string> = {
  faq: "General question",
  order_status: "Order status",
  refund: "Refund",
  payment: "Payment",
  account: "Account",
  complaint: "Complaint",
  bug_report: "Product issue",
  feature_request: "Feature request",
  human_agent: "Human support",
  unknown: "Unclassified",
}
const starterPrompts = [
  "Where is my order?",
  "What is your refund policy?",
  "I was charged twice for my subscription.",
]

export default function AgentPage() {
  const { theme, setTheme } = useTheme()
  const stream = useStream<SupportState, SupportInterrupt>({
    assistantId: "agent",
    apiUrl: import.meta.env.VITE_LANGGRAPH_API_URL ?? "http://localhost:2024",
  })

  const [draft, setDraft] = useState("")
  const [email, setEmail] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [copied, setCopied] = useState(false)

  const bottom = useRef<HTMLDivElement>(null)
  const state = stream.values
  const response = state.response?.trim()
  const interrupt = stream.interrupt as { value: SupportInterrupt } | undefined
  const error = stream.error
    ? "The agent could not be reached. Check that the LangGraph server is running."
    : null
  const trace = getTrace(state)
  const progress = trace.length
    ? (trace.filter((item) => item.complete).length / trace.length) * 100
    : 0
  const scroll = () =>
    requestAnimationFrame(() =>
      bottom.current?.scrollIntoView({ behavior: "smooth" })
    )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const question = draft.trim()
    if (!question || stream.isLoading) return
    setDraft("")
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}`, role: "user", content: question },
    ])
    await stream.submit({
      customerQuestion: question,
      ...(email ? { customerMail: email } : {}),
    })
    scroll()
  }

  const answerInterrupt = async (event: FormEvent) => {
    event.preventDefault()
    if (!email.trim() || stream.isLoading) return
    await stream.respond(email.trim())
    scroll()
  }

  const reset = () => {
    setDraft("")
    setEmail("")
    setMessages([])
    void stream.stop({ cancel: true })
  }

  const assistantText =
    response || (stream.isLoading ? "Working through your request…" : "")

  return (
    <main className="min-h-svh bg-[#071016] text-slate-100">
      <div className="mx-auto flex min-h-svh max-w-[1600px] flex-col border-x border-white/[0.06] bg-[radial-gradient(circle_at_75%_-20%,rgba(21,112,131,0.18),transparent_34%),#0a151b]">
        <header className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-300 text-[#061016]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                Joseph Customer support
              </p>
              <p className="text-xs text-slate-500">AI service desk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-300" /> Graph
              online
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-white/[0.07] hover:text-white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]"
              onClick={reset}
            >
              <Plus className="mr-2 size-4" />
              New conversation
            </Button>
          </div>
        </header>
        <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="flex min-h-[calc(100svh-5rem)] min-w-0 flex-col">
            <div className="border-b border-white/[0.06] px-5 py-7 md:px-10">
              <div className="mx-auto max-w-3xl">
                <p className="mb-2 text-xs font-medium tracking-[0.22em] text-cyan-300/75 uppercase">
                  Joseph Customer support
                </p>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  How can we help today?
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Ask a question and watch your request move through Joseph’s
                  support graph in real time.
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-8 md:px-10">
              <div className="mx-auto flex max-w-3xl flex-col gap-5">
                {!messages.length && !assistantText && !stream.isLoading && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {starterPrompts.map((item) => (
                      <button
                        key={item}
                        onClick={() => setDraft(item)}
                        className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left text-sm text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05]"
                      >
                        <MessageSquareText className="mb-7 size-4 text-cyan-300" />
                        {item}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "user"
                          ? "order-2 bg-slate-700"
                          : "bg-cyan-300/10 text-cyan-300"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6",
                        message.role === "user"
                          ? "order-1 rounded-tr-sm bg-[#123442]"
                          : "rounded-tl-sm border border-white/[0.07] bg-white/[0.04] text-slate-300"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {assistantText && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-300">
                      <Bot className="size-4" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300">
                      {stream.isLoading && !response && (
                        <LoaderCircle className="mr-2 inline size-4 animate-spin text-cyan-300" />
                      )}
                      {assistantText}
                      {response && (
                        <button
                          className="ml-3 text-slate-500 hover:text-white"
                          onClick={() => {
                            void navigator.clipboard?.writeText(response)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 1200)
                          }}
                          aria-label="Copy response"
                        >
                          {copied ? (
                            <Check className="inline size-3.5" />
                          ) : (
                            <Copy className="inline size-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {interrupt && (
                  <form
                    onSubmit={answerInterrupt}
                    className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-300/10 text-amber-300">
                        <CircleHelp className="size-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-100">
                          A little more information
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-100/65">
                          {interrupt.value.reason ??
                            "Please provide the detail needed to continue."}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute top-3 left-3 size-4 text-slate-500" />
                            <input
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder="Your email address"
                              type="email"
                              className="h-10 w-full rounded-lg border border-white/10 bg-[#071016] pr-3 pl-9 text-sm outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-300/40"
                              required
                            />
                          </div>
                          <Button className="h-10 bg-amber-300 text-[#1b1607] hover:bg-amber-200">
                            Continue <ArrowUp className="ml-2 size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {error && (
                  <div className="flex items-center gap-3 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm text-rose-200">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                    <button
                      className="ml-auto"
                      onClick={() => stream.stop({ cancel: false })}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
                <div ref={bottom} />
              </div>
            </div>
            <form
              onSubmit={submit}
              className="border-t border-white/[0.07] px-5 py-5 md:px-10"
            >
              <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-cyan-300/30">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      void submit(event)
                    }
                  }}
                  placeholder="Describe what you need help with…"
                  rows={1}
                  className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-600"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!draft.trim() || stream.isLoading}
                  className="size-11 rounded-xl bg-cyan-300 text-[#061016] hover:bg-cyan-200 disabled:bg-white/10 disabled:text-slate-600"
                  aria-label="Send question"
                >
                  <ArrowUp className="size-5" />
                </Button>
              </div>
              <p className="mx-auto mt-2 max-w-3xl text-[11px] text-slate-600">
                AI-generated support can make mistakes. Never share passwords or
                payment credentials.
              </p>
            </form>
          </section>
          <aside className="border-t border-white/[0.07] bg-black/10 lg:border-t-0 lg:border-l">
            <div className="sticky top-0 p-5 md:p-6">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                    Agent execution
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Live graph telemetry
                  </p>
                </div>
                <Activity className="size-4 text-cyan-300" />
              </div>
              <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Run progress</span>
                  <span className="font-mono text-cyan-300">
                    {stream.isLoading
                      ? "ACTIVE"
                      : trace.length
                        ? "READY"
                        : "IDLE"}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-cyan-300 transition-all"
                    style={{
                      width: `${stream.isLoading ? Math.max(progress, 12) : progress}%`,
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric
                    icon={<GitBranch className="size-3.5" />}
                    label="Intent"
                    value={
                      state.intent
                        ? (intents[state.intent] ?? state.intent)
                        : "Waiting"
                    }
                  />
                  <Metric
                    icon={<Zap className="size-3.5" />}
                    label="Confidence"
                    value={
                      state.confidence != null
                        ? `${Math.round(state.confidence * 100)}%`
                        : "—"
                    }
                  />
                </div>
              </div>
              <div className="mb-7">
                <p className="mb-3 text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                  Execution path
                </p>
                <div className="space-y-1">
                  {!trace.length && (
                    <div className="rounded-xl border border-dashed border-white/10 p-4 text-xs leading-5 text-slate-600">
                      Your agent path will appear here once you send a question.
                    </div>
                  )}
                  {trace.map((item) => (
                    <div
                      key={item.node}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    >
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border",
                          item.complete
                            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-300"
                            : "border-cyan-300/40 bg-cyan-300/10 text-cyan-300"
                        )}
                      >
                        {item.complete ? (
                          <Check className="size-3" />
                        ) : (
                          <LoaderCircle className="size-3 animate-spin" />
                        )}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs text-slate-300">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-300">
                  <ShieldCheck className="size-4 text-emerald-300" />{" "}
                  Privacy-first support
                </div>
                <p className="text-xs leading-5 text-slate-500">
                  The trace shows progress only—internal instructions and
                  private tool data stay hidden.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function getTrace(state: SupportState): TraceItem[] {
  const items: TraceItem[] = []
  if (state.customerQuestion)
    items.push({ node: "read", label: "Reading your question", complete: true })
  if (state.intent)
    items.push({
      node: "analyze",
      label: "Understanding intent",
      complete: true,
    })
  if (state.needsClarification)
    items.push({
      node: "clarify",
      label: "Requesting more detail",
      complete: !state.response,
    })
  else if (state.intent)
    items.push({
      node: "route",
      label: "Routing to support specialist",
      complete: true,
    })
  if (state.response)
    items.push({ node: "response", label: "Writing response", complete: true })
  else if (state.intent && !state.needsClarification)
    items.push({ node: "response", label: "Writing response", complete: false })
  return items
}
function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-black/10 p-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-wider text-slate-600 uppercase">
        {icon}
        {label}
      </div>
      <p className="truncate text-xs text-slate-300">{value}</p>
    </div>
  )
}
