"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Local",
    price: "$0",
    description: "Run the current project on your machine",
    features: [
      "Unlimited local jobs",
      "Up to 200 pages",
      "14 languages",
      "Open source codebase",
      "Community setup",
    ],
    cta: "Start translating",
    popular: false,
  },
  {
    name: "Self-hosted",
    price: "Your infra",
    description: "Deploy and configure it for your workflow",
    features: [
      "FastAPI endpoints",
      "Configurable provider",
      "Environment-based setup",
      "Frontend workspace",
      "Full source control",
      "API documentation",
    ],
    cta: "Open workspace",
    popular: true,
  },
  {
    name: "Managed",
    price: "Planned",
    description: "Hosted collaboration features are not available yet",
    features: [
      "Persistent job storage",
      "Team workspaces",
      "Authentication",
      "OCR processing",
      "Operational monitoring",
      "Support options",
    ],
    cta: "Coming soon",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose how you run it
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Use the local project today or adapt the open architecture for your
            environment.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="surface"
                className={`relative h-full ${
                  plan.popular
                    ? "border-brand/50 shadow-[0_0_40px_-10px_hsl(263_70%_50%/0.3)]"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price === "$0" && (
                      <span className="text-muted-foreground">/forever</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-4 w-4 shrink-0 text-brand" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Managed" ? (
                    <Button variant="outline" className="mt-8 w-full" disabled>
                      {plan.cta}
                    </Button>
                  ) : (
                    <LinkButton
                      href="/translate"
                      variant={plan.popular ? "brand" : "outline"}
                      className="mt-8 w-full"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </LinkButton>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
