"use client";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, FileSearch, GraduationCap } from "lucide-react";

const cases = [
  {
    icon: Briefcase,
    label: "Business",
    title: "Reports and proposals",
    text: "Create readable translated copies of reports, proposals, and text-first business documents.",
  },
  {
    icon: GraduationCap,
    label: "Education",
    title: "Learning material",
    text: "Translate lecture notes, handouts, and research material for multilingual classrooms.",
  },
  {
    icon: FileSearch,
    label: "Research",
    title: "Reference documents",
    text: "Understand text-based PDFs in another language without copying every paragraph.",
  },
  {
    icon: BookOpen,
    label: "Everyday",
    title: "Guides and manuals",
    text: "Turn instructions and reference guides into a language your audience can read.",
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="border-y border-white/[0.06] bg-white/[0.015] py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Made for real work
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            One workflow, many documents
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            A focused translation tool for PDFs where readable content matters
            more than complicated setup.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((item) => (
            <motion.article
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={item.title}
              className="group rounded-2xl border border-white/[0.08] bg-surface/60 p-6 transition hover:-translate-y-1 hover:border-brand/30"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <h3 className="mt-7 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
