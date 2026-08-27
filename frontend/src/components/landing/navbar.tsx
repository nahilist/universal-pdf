"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass mt-4 flex h-14 items-center justify-between rounded-full px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-brand-text">◈</span>{" "}
              <span className="text-white">LINGUAFLOW</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#product"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Use cases
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <LinkButton
              href="/translate"
              variant="brand"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Start translating
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
