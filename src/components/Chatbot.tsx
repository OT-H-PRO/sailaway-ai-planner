import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Compass, MessageSquare, User, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const suggestedPrompts = [
  "Plan a wedding timeline",
  "Help me organize a corporate retreat",
  "Create a birthday party checklist",
  "Suggest luxury venues for 100 guests",
  "Write an event invitation email",
];

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-surface-elevated text-gold"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-surface-elevated text-foreground rounded-bl-md border border-glass-border"
        }`}
      >
        {text || (
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function Chatbot() {
  const { messages, sendMessage, status, input, setInput } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-[calc(100vh-280px)] min-h-[500px] flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="space-y-6 p-2">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-6 rounded-full bg-surface-elevated p-5 shadow-gold-sm">
                  <Compass className="h-10 w-10 text-gold" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  How can I help you plan?
                </h3>
                <p className="mb-8 max-w-md text-sm text-muted-foreground">
                  I&apos;m your event planning concierge. Ask me about timelines,
                  venues, vendors, or anything event-related.
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setInput(prompt);
                        textareaRef.current?.focus();
                      }}
                      className="rounded-full border border-glass-border bg-glass px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {status === "submitted" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-gold">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-glass-border bg-surface-elevated px-4 py-3">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-glass-border bg-glass p-4 backdrop-blur-md"
      >
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your event..."
            rows={1}
            className="min-h-[48px] resize-none border-glass-border bg-surface-elevated py-3"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
