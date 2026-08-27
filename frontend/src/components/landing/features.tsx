"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Layers, Globe, Lock, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "PDF-aware output",
    description:
      "Creates a new PDF at the original page dimensions and places translated content into a readable document.",
  },
  {
    icon: Zap,
    title: "Background processing",
    description:
      "Jobs run outside the request cycle, so the interface can show progress while each page is processed.",
  },
  {
    icon: Globe,
    title: "14 languages",
    description:
      "Translate between popular languages including Hindi, Spanish, French, German, Chinese, Japanese, and Arabic.",
  },
  {
    icon: Layers,
    title: "Strict PDF validation",
    description:
      "Corrupt files, invalid formats, oversize uploads, and documents above the page limit are rejected early.",
  },
  {
    icon: Lock,
    title: "Self-hostable",
    description:
      "Run the application and its API in your own environment and choose how the translation provider is configured.",
  },
  {
    icon: Sparkles,
    title: "Clear job states",
    description:
      "Follow upload, processing, translation, completion, and failure states from one focused workspace.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
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
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="surface"
                className="h-full transition-colors hover:border-brand/30"
              >
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
