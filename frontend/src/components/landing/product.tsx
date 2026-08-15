"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileCheck, Languages, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Product() {
  return (
    <section id="product" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Translate documents, not just text
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Most translation tools break your documents. Tables become unreadable,
              images get misaligned, and formatting vanishes. LinguaFlow is different.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Structure-aware</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzes PDF structure before translating to preserve hierarchy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Contextual translation</h3>
                  <p className="text-sm text-muted-foreground">
                    Understands tables, lists, and paragraphs as semantic units.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Pixel-perfect output</h3>
                  <p className="text-sm text-muted-foreground">
                    Rebuilds the PDF with translated text fitting original boundaries.
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="brand"
              className="mt-8 group"
              onClick={() => window.location.assign("/translate")}
            >
              Try it now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-brand/5 blur-3xl" />
            <div className="relative rounded-2xl border border-border/50 bg-surface/30 p-6 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="h-4 w-1/3 rounded bg-muted/40" />
                <div className="h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-5/6 rounded bg-muted/30" />
                <div className="h-3 w-2/3 rounded bg-muted/30" />
                <div className="mt-6 rounded-lg border border-border/30 bg-graphite/50 p-4">
                  <div className="h-3 w-full rounded bg-muted/30" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-muted/30" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-muted/30" />
                </div>
                <div className="mt-4 h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-5/6 rounded bg-muted/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
