"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
} from "@/components/ui/PrimaryShine";

const navLinks = [
  { label: "New Project", href: "/new-project" },
  { label: "Residential", href: "/residential" },
  { label: "Commercial", href: "/commercial" },
  { label: "Developers", href: "/developers" },
  { label: "News & Regulations", href: "/news-and-regulations" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 isolate overflow-visible border-b border-accent-light/60 px-5 shadow-[0_0_40px_rgba(0,0,0,0.15)] min-[1441px]:overflow-hidden min-[1441px]:px-24">
      <PrimaryShineBackdrop variant="navbar" />
      <PrimaryShineAccents size="navbar" />

      <div className="relative z-10 mx-auto flex h-[124px] max-w-[1248px] items-center justify-between min-[1441px]:gap-12">
        <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo.svg"
            alt="Suits & Sand Real Estate"
            width={228}
            height={224}
            priority
            className="h-[96px] w-[128px] min-[1441px]:h-[150px] min-[1441px]:w-[200px]"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden min-[1441px]:block">
          <ul className="group/nav flex h-12 w-auto items-center justify-center gap-2 rounded-[24px] bg-transparent px-6">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;

              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`flex h-12 shrink-0 items-center whitespace-nowrap px-2.5 py-2.5 font-sans text-xl leading-7 text-white underline-offset-4 transition-all hover:underline ${active
                      ? "underline group-hover/nav:no-underline hover:!underline"
                      : ""
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={mobileNavId}
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-20 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-accent-light/70 bg-primary/40 text-white transition-colors hover:bg-primary/60 min-[1441px]:hidden"
        >
          {menuOpen ? (
            <LuX className="size-6 stroke-[2.5]" aria-hidden="true" />
          ) : (
            <LuMenu className="size-6 stroke-[2.5]" aria-hidden="true" />
          )}
        </button>

        <div
          className="hidden w-[128px] shrink-0 min-[1441px]:block"
          aria-hidden="true"
        />
      </div>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-x-0 bottom-0 top-[124px] z-40 bg-black/40 min-[1441px]:hidden"
        />
      ) : null}

      <nav
        id={mobileNavId}
        aria-label="Mobile navigation"
        className={`absolute inset-x-0 top-full z-50 min-[1441px]:hidden border-b border-accent-light/60 shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-[max-height,opacity] duration-300 ease-out ${menuOpen
            ? "max-h-[420px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
          } overflow-hidden`}
      >
        <div className="relative isolate">
          <PrimaryShineBackdrop variant="navbar" />
          <PrimaryShineAccents size="navbar" />

          <ul className="relative z-10 flex flex-col gap-1 px-4 py-4">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;

              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-[48px] items-center rounded-xl px-4 font-sans text-lg leading-7 text-white transition-colors ${active
                        ? "bg-white/15 font-medium underline decoration-accent-light underline-offset-4"
                        : "hover:bg-white/10"
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
