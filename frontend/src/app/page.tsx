import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Split, Scale, Link2, FileText, Globe, Lock, Zap, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { ArcLogo } from "@/components/built-on-arc";

const problems = [
  {
    icon: Lock,
    title: "Trust between parties",
    description: "Buyers worry about paying upfront. Sellers worry about not getting paid. FlowPay locks funds in escrow so neither party has to trust the other.",
  },
  {
    icon: Split,
    title: "Complex multi-party splits",
    description: "Splitting payments between seller, supplier, and platform manually is error-prone. FlowPay automates the split in one transaction.",
  },
  {
    icon: Scale,
    title: "No dispute mechanism",
    description: "When something goes wrong, there is no resolution path. FlowPay provides an arbiter-based dispute system with partial settlement options.",
  },
];

const features = [
  {
    icon: FileText,
    title: "Invoices",
    description: "Create professional invoices with public pages, QR codes, and shareable links.",
  },
  {
    icon: Shield,
    title: "Escrow",
    description: "Buyer funds are locked onchain until delivery is confirmed or dispute is resolved.",
  },
  {
    icon: Split,
    title: "Split Payments",
    description: "Automate settlement between seller, supplier, and platform in a single transaction.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description: "Arbiter can release, refund, or partially settle any disputed payment.",
  },
  {
    icon: Link2,
    title: "Payment Links",
    description: "Send a link and let anyone view, fund, or track a payment on ArcScan.",
  },
  {
    icon: Globe,
    title: "Transparent Records",
    description: "Every payment and settlement is recorded onchain for full accountability.",
  },
];

const advantages = [
  "Instant settlement — no waiting for bank transfers",
  "Non-custodial — funds locked in smart contract, not held by third party",
  "Lower costs — pay only for gas, no intermediary fees",
  "Fully transparent — every transaction auditable onchain",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav — glass effect */}
      <nav className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <Image src="/icon.svg" alt="FlowPay" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-semibold">{APP_NAME}</span>
          </Link>
          <Link href="/dashboard" className="cursor-pointer">
            <Button size="sm" className="gap-2 rounded-full">
              Launch App <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero — mesh gradient background */}
      <section className="relative overflow-hidden px-4 py-24 text-center md:py-36">
        <div className="absolute inset-0 -z-10 mesh-bg" />
        <div className="mx-auto max-w-3xl fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live on Arc Testnet
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Programmable USDC
            <br />
            payments <span className="gradient-text">built on Arc</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            FlowPay solves trust automation and transparency in payments
            Escrow-protected transactions automatic multi-party splits and
            onchain dispute resolution all in one workflow
          </p>

          {/* Logos */}
          <div className="mt-10 flex items-center justify-center gap-8">
            <Image src="/logo.svg" alt="FlowPay" width={180} height={44} className="h-10 md:h-12 w-auto" />
            <div className="h-10 w-px bg-border md:h-12" />
            <ArcLogo height={36} className="h-9 md:h-11 w-auto" />
          </div>

          <div className="mt-10">
            <Link href="/dashboard" className="cursor-pointer">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Launch App <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-t px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium text-primary">THE PROBLEM</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              The problem FlowPay solves
            </h2>
            <p className="mt-3 text-muted-foreground">
              Payments between untrusted parties are slow risky and hard to audit
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((item) => (
              <Card key={item.title} className="card-hover border-border/50">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium text-primary">FEATURES</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover group border-border/50">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="border-t px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium text-primary">WHY FLOWPAY</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Why choose FlowPay
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {advantages.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium text-primary">HOW IT WORKS</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Three steps to settle
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Create", description: "Set up a payment with split rules and deadlines." },
              { step: "02", title: "Fund", description: "Buyer deposits USDC into the escrow contract." },
              { step: "03", title: "Settle", description: "Auto-split USDC to seller supplier and platform." },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-border/50 bg-card p-6 card-hover">
                <span className="text-5xl font-bold text-primary/15">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 px-4 py-12 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          {/* Social Links */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/andi_phy" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-card/50 transition-all hover:border-primary/30 hover:bg-accent hover:scale-105">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://t.me/edhovx" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-card/50 transition-all hover:border-primary/30 hover:bg-accent hover:scale-105">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.314.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.231-.23 3.69-3.383 3.776-3.677.008-.034.012-.162-.061-.23-.072-.07-.179-.046-.256-.026-.109.024-1.856 1.18-5.24 3.458-.495.34-.944.506-1.347.5-.443-.007-1.294-.25-1.928-.455-.776-.252-1.393-.386-1.338-.815.028-.226.345-.458.951-.695 3.728-1.625 6.21-2.696 8.446-3.746 1.206-.566 1.458-.66 1.673-.66z"/></svg>
              </a>
              <a href="https://discord.com/users/edhovx" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-card/50 transition-all hover:border-primary/30 hover:bg-accent hover:scale-105">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="https://github.com/edhovx" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-card/50 transition-all hover:border-primary/30 hover:bg-accent hover:scale-105">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>

            {/* Feedback */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">Was this page helpful?</p>
              <div className="flex items-center gap-2">
                <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-xs font-medium transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-500">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7"/><path d="M7 10V2a1 1 0 0 1 1-1h3.5a2 2 0 0 1 2 2 2 2 0 0 1-2 2H7"/></svg>
                  Yes
                </button>
                <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-xs font-medium transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17"/><path d="M17 14v8a1 1 0 0 0 1 1h3.5a2 2 0 0 0 2-2 2 2 0 0 0-2-2H17"/></svg>
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/40 pt-6 sm:flex-row sm:justify-between">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </span>
            <p className="text-xs text-muted-foreground">
              Built on Arc. Arc is a trademark of Circle Internet Group, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
