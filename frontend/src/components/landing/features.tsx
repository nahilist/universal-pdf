"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Layers, Globe, Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Layout Preservation",
    description:
      "Every table, image, and formatting detail stays intact. Your document looks identical, just in a new language.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by distributed workers and optimized pipelines. Translate 100-page documents in minutes.",
  },
  {
    icon: Globe,
    title: "100+ Languages",
    description:
      "From Hindi to Japanese, Arabic to Spanish. Automatic source language detection included.",
  },
  {
    icon: Layers,
    title: "Smart OCR",
    description:
      "Automatically detects scanned PDFs and extracts text with state-of-the-art OCR before translating.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "End-to-end encryption, SOC 2 compliant infrastructure. Your documents never leave our secure environment.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Context-aware translation that understands document structure, technical terminology, and nuance.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for precision
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every detail matters when translating professional documents.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="surface" className="h-full transition-colors hover:border-brand/30">
                <CardHeader>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
