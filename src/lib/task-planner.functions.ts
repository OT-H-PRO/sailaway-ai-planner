import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateTasksInput = z.object({
  eventType: z.string().min(1),
  date: z.string().min(1),
  guestCount: z.number().min(1),
  goals: z.string().min(1),
});

export type TaskItem = {
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  completed?: boolean;
};

export type TaskPhase = {
  phase: string;
  tasks: TaskItem[];
};

export const generateTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateTasksInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        'You are Sail Away\'s event planning task strategist. Generate a structured task timeline for events. Return ONLY a valid JSON array with exactly this shape, no markdown, no code blocks:\n[\n  { "phase": "Before Event", "tasks": [{ "title": "...", "priority": "high|medium|low", "deadline": "e.g. 2 weeks before" }] },\n  { "phase": "During Event", "tasks": [...] },\n  { "phase": "After Event", "tasks": [...] }\n]',
      prompt: `Create a task plan for a ${data.eventType} with ${data.guestCount} guests scheduled for ${data.date}. Event goals: ${data.goals}. Include at least 4-6 tasks per phase with realistic deadlines and appropriate priority levels (high/medium/low).`,
    });

    // Clean up potential markdown wrapping
    const cleaned = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: TaskPhase[] = JSON.parse(cleaned);
    return { tasks: parsed };
  });
