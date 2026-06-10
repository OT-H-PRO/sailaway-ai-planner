import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ClipboardList, MessageSquare, Anchor } from "lucide-react";

import { EmailGenerator } from "@/components/EmailGenerator";
import { TaskPlanner } from "@/components/TaskPlanner";
import { Chatbot } from "@/components/Chatbot";

const tabs = [
  {
    id: "email",
    label: "Email Generator",
    icon: Mail,
    component: EmailGenerator,
  },
  {
    id: "tasks",
    label: "Task Planner",
    icon: ClipboardList,
    component: TaskPlanner,
  },
  {
    id: "chat",
    label: "Concierge",
    icon: MessageSquare,
    component: Chatbot,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sail Away — Event Planning Concierge" },
      { name: "description", content: "Plan beautifully. Sail smoothly. AI-powered event planning assistant." },
      { property: "og:title", content: "Sail Away — Event Planning Concierge" },
      { property: "og:description", content: "Plan beautifully. Sail smoothly. AI-powered event planning assistant." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState("email");

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? EmailGenerator;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-gold-sm">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Sail Away
              </h1>
              <p className="text-xs text-muted-foreground">
                Plan beautifully. Sail smoothly.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 rounded-xl bg-surface p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-primary shadow-gold-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border py-6 text-center text-sm text-muted-foreground">
        <p>Sail Away &mdash; Your event planning concierge</p>
      </footer>
    </div>
  );
}
