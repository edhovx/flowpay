"use client";

import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border px-8 py-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </span>
        <div className="flex gap-4">
          <a href="https://twitter.com/andi_phy" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#d8b15f]">X</a>
          <a href="https://t.me/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#d8b15f]">Telegram</a>
          <a href="https://discord.com/users/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#d8b15f]">Discord</a>
          <a href="https://github.com/edhovx" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#d8b15f]">GitHub</a>
          <a href="mailto:mardotillah.088@gmail.com" className="text-xs text-muted-foreground hover:text-[#d8b15f]">Email</a>
        </div>
      </div>
    </footer>
  );
}
