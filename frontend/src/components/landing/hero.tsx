"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-border/50 bg-surface/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-brand animate-pulse" />
            Now supporting 100+ languages
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-balance">Your PDF.</span>
            <br />
            <span className="text-balance">Any Language.</span>
            <br />
            <span className="text-balance gradient-brand-text">Same Document.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Translate documents across languages while preserving layout,
            typography, tables and visual structure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              variant="brand"
              size="lg"
              className="group"
              onClick={() => window.location.assign("/translate")}
            >
              Translate a PDF
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              See how it works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 w-full max-w-3xl"
          >
            <div className="relative rounded-2xl border border-border/50 bg-surface/30 p-1 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-stretch gap-4 rounded-xl bg-graphite/50 p-4">
                <div className="flex-1 rounded-lg border border-border/50 bg-graphite/80 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-brand" />
                    <span className="text-sm font-medium text-foreground">
                      English PDF
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 rounded bg-muted/40" />
                    <div className="h-3 w-full rounded bg-muted/40" />
                    <div className="h-3 w-5/6 rounded bg-muted/40" />
                    <div className="h-3 w-2/3 rounded bg-muted/40" />
                    <div className="h-3 w-4/5 rounded bg-muted/40" />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand"
                  >
                    <Languages className="h-6 w-6" />
                  </motion.div>
                </div>

                <div className="flex-1 rounded-lg border border-border/50 bg-graphite/80 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-brand" />
                    <span className="text-sm font-medium text-foreground">
                      Hindi PDF
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 rounded bg-muted/40" />
                    <div className="h-3 w-full rounded bg-muted/40" />
                    <div className="h-3 w-5/6 rounded bg-muted/40" />
                    <div className="h-3 w-2/3 rounded bg-muted/40" />
                    <div className="h-3 w-4/5 rounded bg-muted/40" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
