import Image from "next/image";
import { ArrowRight, CheckCircle2, FileText, Languages } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1.5 text-sm text-brand">
              <span className="mr-2 h-2 w-2 rounded-full bg-brand" />
              Open-source PDF translation workspace
            </div>
            <h1 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Documents that speak
              <span className="gradient-brand-text"> your language.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Translate text-based PDFs into 14 languages with automatic source
              detection, visible progress, and downloadable output.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href="/translate"
                variant="brand"
                size="lg"
                className="group rounded-xl"
              >
                Translate a PDF
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </LinkButton>
              <LinkButton
                href="#how-it-works"
                variant="outline"
                size="lg"
                className="rounded-xl"
              >
                See how it works
              </LinkButton>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No account required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Up to 200 pages
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Self-hostable
              </span>
            </div>
          </div>

          <div className="relative lg:translate-x-8">
            <div className="absolute -inset-8 rounded-full bg-brand/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-2xl shadow-black/50">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/linguaflow-team-hero.png"
                  alt="A diverse team reviewing a document together"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="block aspect-[3/2] h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Built for people working across languages
                    </p>
                    <p className="mt-1 text-xs text-white/65">
                      Reports, learning material, research, and guides
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-xs text-white backdrop-blur-md sm:flex">
                    <Languages className="h-4 w-4 text-violet-300" />
                    14 languages
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-white/[0.08] bg-background/70 px-3 py-4 backdrop-blur-xl sm:px-5">
                {["Upload", "Translate", "Download"].map((step, index) => (
                  <div
                    key={step}
                    className="relative flex min-w-0 items-center justify-center gap-2 px-1 sm:gap-3 sm:px-3"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-brand/20 bg-brand/10 text-[11px] font-semibold text-brand sm:h-8 sm:w-8">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-medium sm:text-sm">
                      {step}
                    </span>
                    {index < 2 && (
                      <ArrowRight className="absolute -right-2 h-3.5 w-3.5 text-muted-foreground/40 sm:right-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <FileText className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  PDF workflow
                </span>
                <span className="block text-sm font-semibold">
                  Upload → Translate → Download
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
