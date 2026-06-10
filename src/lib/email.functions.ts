import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateEmailInput = z.object({
  eventName: z.string().min(1),
  tone: z.string().min(1),
  recipientType: z.string().min(1),
  keyDetails: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateEmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are Sail Away's professional email composer. Write elegant, polished event-related emails. Output ONLY the email with a clear subject line at the top (format: 'Subject: ...') followed by the body. No extra commentary, no markdown code blocks. Use professional but warm language appropriate for high-end events.",
      prompt: `Write a ${data.tone} email for a ${data.recipientType} about the event "${data.eventName}". Key details to include: ${data.keyDetails}`,
    });

    return { email: text };
  });
