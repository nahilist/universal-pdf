"use client";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-brand-text">◈</span>{" "}
              <span className="text-white">LINGUAFLOW</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#product"
              className="hover:text-foreground transition-colors"
            >
              Product
            </a>
            <a
              href="#use-cases"
              className="hover:text-foreground transition-colors"
            >
              Use cases
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <a
              href="/translate"
              className="hover:text-foreground transition-colors"
            >
              Translate
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinguaFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
