"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const securityItems = [
  {
    icon: Lock,
    title: "End-to-end encryption",
    description: "All documents are encrypted in transit and at rest using AES-256.",
  },
  {
    icon: Eye,
    title: "Zero-knowledge architecture",
    description: "We never store or train on your document content. Period.",
  },
  {
    icon: FileCheck,
    title: "SOC 2 Type II certified",
    description: "Enterprise-grade security controls with regular third-party audits.",
  },
  {
    icon: Shield,
    title: "GDPR & CCPA compliant",
    description: "Full data portability, right to deletion, and privacy controls.",
  },
];

export function Security() {
  return (
    <section id="security" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Security you can trust
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with the same security standards as the world&apos;s leading tech companies.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="graphite" className="h-full text-center">
                <CardHeader>
                  <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
