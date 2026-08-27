"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const securityItems = [
  {
    icon: Lock,
    title: "Deployment control",
    description:
      "Run the API locally or deploy it inside infrastructure you control.",
  },
  {
    icon: Eye,
    title: "Transparent workflow",
    description:
      "The open codebase makes upload, storage, and translation behavior inspectable.",
  },
  {
    icon: FileCheck,
    title: "Validated uploads",
    description:
      "The API checks file structure, size, extension, and page count before processing.",
  },
  {
    icon: Shield,
    title: "Configurable provider",
    description:
      "Translation behavior is selected through backend configuration instead of hidden in the UI.",
  },
];

export function Security() {
  return (
    <section id="security" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Control starts with clarity
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Understand where documents go and choose the deployment model that
            fits your needs.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={false}
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
