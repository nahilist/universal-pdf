"use client";
import { ArrowRight, HelpCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const questions = [
  [
    "What kind of PDF works best?",
    "Text-based PDFs with selectable text work best. Image-only scans need OCR, which is not available in the current version.",
  ],
  [
    "Which languages are supported?",
    "The current engine includes English, Hindi, Spanish, French, German, Chinese, Japanese, Arabic, Portuguese, Russian, Italian, Korean, Dutch, and Turkish.",
  ],
  [
    "What are the upload limits?",
    "Files can be up to 50 MB and 200 pages. The server validates the PDF and page count before creating a job.",
  ],
  [
    "Will the result look exactly the same?",
    "LinguaFlow creates a clean PDF with translated text. Complex layouts, forms, and unusual fonts may not be reproduced exactly in this early version.",
  ],
  [
    "How long does translation take?",
    "Time depends on page count, text volume, and the translation provider. Progress is shown while the job runs.",
  ],
  [
    "Can I run it privately?",
    "Yes. The app can run on your machine. Translation requests may still use the configured external translation provider.",
  ],
] as const;

export function FAQ() {
  return (
    <>
      <section id="faq" className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
              <HelpCircle className="h-6 w-6" />
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Questions, answered
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              What to expect before you upload your first document.
            </p>
          </div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {questions.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  <span>{question}</span>
                  <span className="text-xl text-brand transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-8 text-sm leading-7 text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-brand/20 bg-brand/10 px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(263_70%_50%/0.2),transparent_55%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Ready when you are
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Turn your next PDF into a document you can actually use.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Upload a text-based PDF, choose a language, and follow the
              progress in one focused workspace.
            </p>
            <LinkButton
              href="/translate"
              variant="brand"
              size="lg"
              className="mt-8"
            >
              Translate a PDF
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
