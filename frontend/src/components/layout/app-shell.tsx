"use client";

import * as React from "react";
import { Sidebar, MobileHeader } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:pl-64">
        <TopBar />
        <MobileHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
