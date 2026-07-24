import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const problems = [
  {
    title: "Trust between parties",
    description: "Buyers worry about paying upfront. Sellers worry about not getting paid. FlowPay locks funds in escrow so neither party has to trust the other.",
  },
  {
    title: "Complex multi-party splits",
    description: "Splitting payments between seller, supplier, and platform manually is error-prone. FlowPay automates the split in one transaction.",
  },
  {
    title: "No dispute mechanism",
    description: "When something goes wrong, there is no resolution path. FlowPay provides an arbiter-based dispute system with partial settlement options.",
  },
];

const features = [
  { title: "Invoices", description: "Create professional invoices with public pages, QR codes, and shareable links." },
  { title: "Escrow", description: "Buyer funds are locked onchain until delivery is confirmed or dispute is resolved." },
  { title: "Split Payments", description: "Automate settlement between seller, supplier, and platform in a single transaction." },
  { title: "Dispute Resolution", description: "Arbiter can release, refund, or partially settle any disputed payment." },
  { title: "Payment Links", description: "Send a link and let anyone view, fund, or track a payment." },
  { title: "Transparent Records", description: "Every payment and settlement is recorded onchain for full accountability." },
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
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <Image src="/icon.svg" alt="FlowPay" width={28} height={28} />
            <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <Link href="/dashboard" className="cursor-pointer">
            <span className="inline-flex cursor-pointer items-center gap-1.5 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-80">
              Launch App <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32 md:py-48">
        <div className="mx-auto max-w-4xl fade-up">
          <div className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#b7c8a3] pulse-dot" />
            Live on Testnet
          </div>
          <h1 className="text-6xl font-medium tracking-tighter md:text-8xl lg:text-9xl">
            FlowPay
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Programmable USDC payments. Escrow-protected transactions, automatic multi-party splits, and onchain dispute resolution — all in one workflow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/dashboard">
              <span className="inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80">
                Launch App <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="inline-flex cursor-pointer items-center gap-2 border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent">
                Read Docs
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#d8b15f]">The Problem</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
            The problem FlowPay solves
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {problems.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-medium text-cream">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#d8b15f]">Features</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
            Everything you need
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card-glow">
                <h3 className="text-base font-medium text-cream">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-[#d8b15f]">Why FlowPay</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
            Why choose FlowPay
          </h2>
          <div className="mt-12 space-y-6">
            {advantages.map((item) => (
              <div key={item} className="flex items-start gap-4 border-b border-border pb-6">
                <span className="mt-1 text-[#b7c8a3]">✓</span>
                <p className="text-base text-cream">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#d8b15f]">How It Works</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
            Three steps to settle
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {[
              { step: "01", title: "Create", description: "Set up a payment with split rules and deadlines." },
              { step: "02", title: "Fund", description: "Buyer deposits USDC into the escrow contract." },
              { step: "03", title: "Settle", description: "Auto-split USDC to seller, supplier, and platform." },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-4xl font-medium text-[#d8b15f]/30">{item.step}</span>
                <h3 className="mt-4 text-xl font-medium text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6">
            {/* Social */}
            <div className="flex gap-4">
              <a href="https://twitter.com/andi_phy" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-cream">X</a>
              <a href="https://t.me/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-cream">Telegram</a>
              <a href="https://discord.com/users/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-cream">Discord</a>
              <a href="https://github.com/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-cream">GitHub</a>
              <a href="mailto:mardotillah.088@gmail.com" className="text-xs text-muted-foreground transition-colors hover:text-cream">Email</a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:justify-between">
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </span>
            <span className="text-xs text-muted-foreground">
              FlowPay is built on Arc™. Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
