"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Upload",
    description:
      "Drop in a valid PDF up to 50 MB and 200 pages. Corrupt files are rejected before processing.",
  },
  {
    number: "02",
    title: "Detect",
    description:
      "The engine reads selectable text and automatically detects the source language when requested.",
  },
  {
    number: "03",
    title: "Translate",
    description:
      "Long page content is split into safe chunks and translated in the background with live progress.",
  },
  {
    number: "04",
    title: "Download",
    description:
      "Receive a reconstructed PDF at the original page size, ready to review and download.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four steps from upload to translated document.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-2xl font-bold text-brand">
                  {step.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <LinkButton
            href="/translate"
            variant="brand"
            size="lg"
            className="group"
          >
            Get started for free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
