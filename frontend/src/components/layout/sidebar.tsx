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
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectButton } from "@/components/wallet/connect-button";

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
      <Image src="/icon.svg" alt="FlowPay" width={28} height={28} />
      <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
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
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      <p className="px-3 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground/40">
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
              "group flex cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium transition-colors stagger-in",
              isActive
                ? "bg-accent text-[#d8b15f]"
                : "text-muted-foreground hover:text-cream",
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="opacity-60 group-hover:opacity-100">{iconMap[link.icon]}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-border lg:sidebar-bg">
        <div className="flex h-14 items-center border-b border-border px-5">
          <FlowPayLogo />
        </div>
        <NavContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 cursor-pointer bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 transform border-r border-border sidebar-bg transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <FlowPayLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <NavContent />
      </div>
    </>
  );
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border glass px-4 lg:hidden">
      <Link href="/" className="flex cursor-pointer items-center gap-2">
        <Image src="/icon.svg" alt="FlowPay" width={24} height={24} />
        <span className="text-sm font-semibold">{APP_NAME}</span>
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
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
