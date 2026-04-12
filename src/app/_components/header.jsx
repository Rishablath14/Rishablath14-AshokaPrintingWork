"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ModeToggle } from "./toggleMode";
import { cn } from "@/lib/utils";

const Header = () => {
  const path = usePathname();
  const isLoginPage = path === "/login";
  const isActivePath = (href) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
  const navLinks = [
    { label: "Overview", link: "/" },
    { label: "New Job", link: "/add" },
    { label: "All Jobs", link: "/customers" },
  ];
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 md:px-8 md:pt-4">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <div className="flex flex-col gap-3 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/90 p-2 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                <Image
                  src="/asp_logo.webp"
                  alt="Ashoka Printing logo"
                  fetchPriority="high"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain filter brightness-0 dark:invert"
                />
              </div>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Ashoka Printing</p>
                <h1 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">Dashboard</h1>
              </div>
            </Link>
            
            <div className="flex lg:hidden items-center justify-end">
              <ModeToggle />
            </div>
          </div>

          {!isLoginPage && (
            <nav className="flex w-full items-center justify-between gap-1 sm:gap-2 overflow-x-auto rounded-full border border-slate-200/80 bg-slate-100/80 p-1.5 dark:border-white/10 dark:bg-white/5 lg:w-auto lg:justify-start lg:flex-wrap">
              {navLinks.map((nav) => (
                <Link
                  key={nav.link}
                  href={nav.link}
                  className={cn(
                    "flex-1 text-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors sm:px-4 lg:flex-none",
                    isActivePath(nav.link)
                      ? "bg-slate-900 text-white shadow-sm dark:bg-sky-400 dark:text-slate-950"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
                  )}
                >
                  {nav.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden lg:flex w-full items-center justify-end gap-3 lg:w-auto">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
