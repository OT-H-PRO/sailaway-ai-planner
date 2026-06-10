import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { ClipboardList, Sparkles, CheckCircle2, Circle, Calendar, Users, Target } from "lucide-react";

import { generateTasks } from "@/lib/task-planner.functions";
import type { TaskPhase } from "@/lib/task-planner.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
};

export function TaskPlanner() {
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [goals, setGoals] = useState("");
  const [phases, setPhases] = useState<TaskPhase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateTasksFn = useServerFn(generateTasks);

  const handleGenerate = async () => {
    if (!eventType || !date || !guestCount || !goals) return;
    setLoading(true);
    setError("");
    try {
      const result = await generateTasksFn({
        data: {
          eventType,
          date,
          guestCount: parseInt(guestCount, 10),
          goals,
        },
      });
      // Initialize completed state
      const withCompleted = result.tasks.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((t) => ({ ...t, completed: false })),
      }));
      setPhases(withCompleted);
    } catch (err) {
      setError("Something went wrong generating your task plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (phaseIndex: number, taskIndex: number) => {
    setPhases((prev) =>
      prev.map((phase, pi) =>
        pi === phaseIndex
          ? {
              ...phase,
              tasks: phase.tasks.map((task, ti) =>
                ti === taskIndex ? { ...task, completed: !task.completed } : task
              ),
            }
          : phase
      )
    );
  };

  const completedCount = phases.reduce(
    (acc, phase) => acc + phase.tasks.filter((t) => t.completed).length,
    0
  );
  const totalCount = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);

  const canGenerate = eventType && date && guestCount && goals;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-2"
      >
        <div className="rounded-xl border border-glass-border bg-glass p-6 backdrop-blur-md">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gold">
            <ClipboardList className="h-5 w-5" />
            Event Details
          </h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Input
                id="eventType"
                placeholder="e.g. Corporate Gala, Wedding, Product Launch"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="border-glass-border bg-surface-elevated"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="eventDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-glass-border bg-surface-elevated pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">Guest Count</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="border-glass-border bg-surface-elevated pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Event Goals & Vision</Label>
              <Textarea
                id="goals"
                placeholder="Describe the atmosphere, key moments, and what success looks like..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={5}
                className="border-glass-border bg-surface-elevated resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold-sm transition-all"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Building your timeline...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Task Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Output Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-3"
      >
        <AnimatePresence mode="wait">
          {phases.length > 0 ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="rounded-xl border border-glass-border bg-glass p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium">
                      {completedCount} of {totalCount} tasks completed
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-4">
                {phases.map((phase, phaseIndex) => (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: phaseIndex * 0.1 }}
                    className="rounded-xl border border-glass-border bg-glass p-5 backdrop-blur-md"
                  >
                    <h4 className="mb-4 text-base font-semibold text-gold-light">
                      {phase.phase}
                    </h4>
                    <div className="space-y-3">
                      {phase.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          onClick={() => toggleTask(phaseIndex, taskIndex)}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-surface-elevated/50 ${
                            task.completed ? "opacity-50" : ""
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                task.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${priorityColors[task.priority]}`}
                              >
                                {task.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {task.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-glass-border bg-glass/50 p-8 text-center backdrop-blur-sm"
            >
              <div className="mb-4 rounded-full bg-surface-elevated p-4">
                <ClipboardList className="h-8 w-8 text-gold-muted" />
              </div>
              <p className="text-lg font-medium text-foreground/80">
                Your task timeline will appear here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter event details and generate a structured plan
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
