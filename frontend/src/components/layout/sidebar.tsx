"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Shield,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectButton } from "@/components/wallet/connect-button";
import { ArcLogo } from "@/components/built-on-arc";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  ArrowLeftRight: <ArrowLeftRight className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

function FlowPayLogo() {
  return (
    <Link href="/" className="flex cursor-pointer items-center gap-2.5">
      <div className="relative">
        <Image src="/icon.svg" alt="FlowPay" width={36} height={36} className="rounded-xl" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold leading-tight tracking-tight">{APP_NAME}</span>
        <span className="text-[10px] text-muted-foreground leading-tight">{APP_TAGLINE}</span>
      </div>
    </Link>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const NavContent = () => (
    <nav className="flex-1 space-y-1 px-3 py-5">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
        Menu
      </p>
      {NAV_LINKS.map((link, i) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all stagger-in",
              isActive
                ? "bg-primary/10 text-primary nav-active-glow"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "bg-transparent text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
            )}>
              {iconMap[link.icon]}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/40 lg:sidebar-bg">
        <div className="flex h-16 items-center border-b border-border/40 px-5">
          <FlowPayLogo />
        </div>
        <NavContent />
        <div className="mt-auto border-t border-border/40 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built on</span>
            <ArcLogo height={14} />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 cursor-pointer bg-black/70 backdrop-blur-md lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/40 sidebar-bg shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
          <FlowPayLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <NavContent />
        <div className="mt-auto border-t border-border/40 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built on</span>
            <ArcLogo height={14} />
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 glass px-4 lg:hidden">
      <Link href="/" className="flex cursor-pointer items-center gap-2">
        <Image src="/icon.svg" alt="FlowPay" width={28} height={28} className="rounded-lg" />
        <span className="text-base font-bold">{APP_NAME}</span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <ConnectButton />
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
