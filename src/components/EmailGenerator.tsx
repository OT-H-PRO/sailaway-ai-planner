import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Sparkles, Copy, Check, RotateCcw } from "lucide-react";

import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const toneOptions = [
  "Formal",
  "Warm & Friendly",
  "Elegant",
  "Casual",
  "Urgent",
  "Appreciative",
];

const recipientOptions = [
  "Guest",
  "Vendor",
  "Venue Manager",
  "Team Member",
  "VIP Attendee",
  "Sponsor",
];

export function EmailGenerator() {
  const [eventName, setEventName] = useState("");
  const [tone, setTone] = useState("");
  const [recipientType, setRecipientType] = useState("");
  const [keyDetails, setKeyDetails] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateEmailFn = useServerFn(generateEmail);

  const handleGenerate = async () => {
    if (!eventName || !tone || !recipientType || !keyDetails) return;
    setLoading(true);
    setError("");
    setEmailResult("");
    try {
      const result = await generateEmailFn({
        data: { eventName, tone: tone.toLowerCase(), recipientType: recipientType.toLowerCase(), keyDetails },
      });
      setEmailResult(result.email);
    } catch (err) {
      setError("Something went wrong generating your email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = eventName && tone && recipientType && keyDetails;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-glass-border bg-glass p-6 backdrop-blur-md">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gold">
            <Mail className="h-5 w-5" />
            Compose Your Email
          </h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="e.g. Summer Gala 2026"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="border-glass-border bg-surface-elevated"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="border-glass-border bg-surface-elevated">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="border-glass-border bg-surface-elevated">
                    {toneOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Recipient</Label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger className="border-glass-border bg-surface-elevated">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent className="border-glass-border bg-surface-elevated">
                    {recipientOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyDetails">Key Details</Label>
              <Textarea
                id="keyDetails"
                placeholder="Date, time, location, dress code, special requests..."
                value={keyDetails}
                onChange={(e) => setKeyDetails(e.target.value)}
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
                  Crafting your email...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Email
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
      >
        <AnimatePresence mode="wait">
          {emailResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl border border-glass-border bg-glass p-6 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gold">
                  <Mail className="h-5 w-5" />
                  Your Email
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEmailResult("");
                      setError("");
                    }}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap rounded-lg bg-surface-elevated p-5 text-sm leading-relaxed text-foreground/90">
                {emailResult}
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
                <Mail className="h-8 w-8 text-gold-muted" />
              </div>
              <p className="text-lg font-medium text-foreground/80">
                Your email will appear here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the details and click Generate Email
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
