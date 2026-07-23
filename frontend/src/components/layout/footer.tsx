"use client";

import * as React from "react";
import { APP_NAME } from "@/lib/constants";
import { Send, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [feedbackSent, setFeedbackSent] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [rating, setRating] = React.useState<"yes" | "no" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    const subject = encodeURIComponent(`FlowPay Feedback - ${rating === "yes" ? "Positive" : "Needs Improvement"}`);
    const body = encodeURIComponent(feedbackText);
    window.location.href = `mailto:mardotillah.088@gmail.com?subject=${subject}&body=${body}`;
    setFeedbackSent(true);
    setFeedbackText("");
    setRating(null);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const iconClass = "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border/50 bg-card/50 transition-all hover:scale-105 hover:border-primary/30 hover:bg-accent";
  const svgClass = "h-3.5 w-3.5 text-muted-foreground hover:text-foreground";

  return (
    <footer className="border-t border-border/40">
      {/* Feedback section */}
      <div style={{ backgroundColor: '#1e3a5f' }} className="px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Feedback Form */}
          <div className="flex-1 lg:max-w-md">
            <h3 className="text-sm font-semibold">Was this page helpful?</h3>
            <p className="mb-3 text-xs text-muted-foreground">Send us your feedback — we read every message.</p>

            {feedbackSent ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Thank you! Your email client should open.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRating("yes")}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      rating === "yes"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border/60 bg-card/50 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7"/><path d="M7 10V2a1 1 0 0 1 1-1h3.5a2 2 0 0 1 2 2 2 2 0 0 1-2 2H7"/></svg>
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating("no")}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      rating === "no"
                        ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                        : "border-border/60 bg-card/50 hover:border-red-500/30 hover:bg-red-500/5"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17"/><path d="M17 14v8a1 1 0 0 0 1 1h3.5a2 2 0 0 0 2-2 2 2 0 0 0-2-2H17"/></svg>
                    No
                  </button>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-3 w-3" /> Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar — social icons right, copyright left */}
      <div className="flex flex-col items-center gap-3 px-6 py-4 sm:flex-row sm:justify-between">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Built on Arc™.
        </span>
        <div className="flex gap-2">
          <a href="https://twitter.com/andi_phy" target="_blank" rel="noopener noreferrer" className={iconClass}>
            <svg className={svgClass} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://t.me/edhovx" target="_blank" rel="noopener noreferrer" className={iconClass}>
            <svg className={svgClass} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.314.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.231-.23 3.69-3.383 3.776-3.677.008-.034.012-.162-.061-.23-.072-.07-.179-.046-.256-.026-.109.024-1.856 1.18-5.24 3.458-.495.34-.944.506-1.347.5-.443-.007-1.294-.25-1.928-.455-.776-.252-1.393-.386-1.338-.815.028-.226.345-.458.951-.695 3.728-1.625 6.21-2.696 8.446-3.746 1.206-.566 1.458-.66 1.673-.66z"/></svg>
          </a>
          <a href="https://discord.com/users/edhovx" target="_blank" rel="noopener noreferrer" className={iconClass}>
            <svg className={svgClass} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </a>
          <a href="https://github.com/edhovx" target="_blank" rel="noopener noreferrer" className={iconClass}>
            <svg className={svgClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
          <a href="mailto:mardotillah.088@gmail.com" className={iconClass}>
            <svg className={svgClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 7-10 5L2 7"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
