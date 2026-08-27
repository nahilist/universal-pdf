"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileCheck, Languages, Zap } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function Product() {
  return (
    <section id="product" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Translate documents, not just text
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Copying text out of a PDF is slow and loses the document context.
              LinguaFlow turns the complete text layer into a downloadable PDF
              workflow.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Page-aware</h3>
                  <p className="text-sm text-muted-foreground">
                    Reads selectable text page by page and keeps the original
                    page dimensions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Automatic detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Detects the source language or lets you choose it
                    explicitly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Downloadable output</h3>
                  <p className="text-sm text-muted-foreground">
                    Reconstructs translated pages into a compact PDF ready to
                    download.
                  </p>
                </div>
              </div>
            </div>
            <LinkButton
              href="/translate"
              variant="brand"
              className="mt-8 group"
            >
              Try it now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </LinkButton>
          </motion.div>

          <motion.div
            initial={false}
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
