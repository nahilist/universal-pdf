"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileOutput,
  FileText,
  Languages,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";

type UploadState =
  "idle" | "dragging" | "uploading" | "processing" | "success" | "error";
const languages = [
  ["auto", "Auto detect"],
  ["en", "English"],
  ["hi", "Hindi"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["pt", "Portuguese"],
  ["zh", "Chinese"],
  ["ja", "Japanese"],
  ["ar", "Arabic"],
] as const;

export default function TranslatePage() {
  const { getToken } = useAuth();
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    "Please upload a valid PDF file.",
  );
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const activeRequest = useRef<AbortController | null>(null);
  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000")
    .replace(/\/+$/, "")
    .replace(/\/api\/v1$/, "");

  // If frontend is loaded over HTTPS (e.g. Vercel) but backend is HTTP,
  // browsers block direct fetch as "Mixed Content" (Failed to fetch).
  // In that case, use relative path "" so it proxies through Next.js rewrites!
  const isHttpsOrigin =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const isHttpBackend = rawApiUrl.startsWith("http://");
  const apiUrl = isHttpsOrigin && isHttpBackend ? "" : rawApiUrl;

  const handleFile = async (file: File) => {
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMessage("Please choose a PDF document.");
      setState("error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("The PDF must be smaller than 50 MB.");
      setState("error");
      return;
    }
    if (sourceLanguage === targetLanguage) {
      setErrorMessage("Source and target languages must be different.");
      setState("error");
      return;
    }
    setFileName(file.name);
    setFileSize(`${(file.size / 1048576).toFixed(1)} MB`);
    setState("uploading");
    setProgress(15);
    setDownloadUrl(null);
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    try {
      const token = await getToken().catch(() => null);
      const uploadHeaders: HeadersInit = {};
      if (token) {
        uploadHeaders["Authorization"] = `Bearer ${token}`;
      }
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch(`${apiUrl}/api/v1/files/upload`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
        signal: createRequestSignal(controller.signal, 120_000),
      });
      if (!uploadResponse.ok) {
        throw new Error(
          await getApiError(uploadResponse, "The PDF upload failed."),
        );
      }
      const upload = (await uploadResponse.json()) as { file_id: string };
      setProgress(25);
      setState("processing");
      const jobHeaders: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        jobHeaders["Authorization"] = `Bearer ${token}`;
      }
      const jobResponse = await fetch(`${apiUrl}/api/v1/jobs`, {
        method: "POST",
        headers: jobHeaders,
        signal: createRequestSignal(controller.signal, 30_000),
        body: JSON.stringify({
          file_id: upload.file_id,
          filename: file.name,
          source_language: sourceLanguage,
          target_language: targetLanguage,
        }),
      });
      if (!jobResponse.ok) {
        throw new Error(
          await getApiError(
            jobResponse,
            "Could not create the translation job.",
          ),
        );
      }
      let job = (await jobResponse.json()) as {
        id: string;
        status: string;
        progress: number;
        download_url?: string;
        error_message?: string;
      };
      let pollCount = 0;
      while (job.status !== "COMPLETED") {
        if (job.status === "FAILED")
          throw new Error(job.error_message ?? "Translation failed.");
        pollCount += 1;
        if (pollCount > 300) {
          throw new Error("Translation took too long to complete. Please try again.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusHeaders: HeadersInit = {};
        if (token) {
          statusHeaders["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${apiUrl}/api/v1/jobs/${job.id}`, {
          headers: statusHeaders,
          signal: createRequestSignal(controller.signal, 15_000),
          cache: "no-store",
        });
        if (!response.ok)
          throw new Error(
            await getApiError(response, "Could not read translation progress."),
          );
        job = await response.json();
        setProgress((current) => Math.max(current, job.progress));
      }
      if (!job.download_url)
        throw new Error("The server did not provide a download link.");
      setProgress(100);
      setDownloadUrl(apiUrl ? `${apiUrl}${job.download_url}` : job.download_url);
      setState("success");
    } catch (error) {
      if (controller.signal.aborted) return;
      let msg =
        error instanceof DOMException && error.name === "TimeoutError"
          ? "The server took too long to respond. Please try a smaller PDF."
          : error instanceof Error
            ? error.message
            : "Translation failed.";
      if (msg.includes("Failed to fetch")) {
        msg =
          "Could not connect to the translation backend. If using HTTPS, ensure your backend supports HTTPS or is routed through the proxy.";
      }
      setErrorMessage(msg);
      setState("error");
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  };

  const reset = () => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setState("idle");
    setProgress(0);
    setFileName(null);
    setFileSize(null);
    setDownloadUrl(null);
  };
  const busy = state === "uploading" || state === "processing";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_5%,hsl(263_70%_50%/0.13),transparent_28%),radial-gradient(circle_at_85%_75%,hsl(220_90%_55%/0.08),transparent_30%)]" />
      <header className="relative z-10 border-b border-white/[0.06] bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm shadow-lg shadow-brand/20">
              L
            </span>
            LinguaFlow
          </a>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <a
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </a>
            </SignedOut>
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to home</span>
            </a>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            AI document translation
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Translate your PDF without losing its structure.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Choose your languages, upload a document, and receive a translated
            PDF ready to download.
          </p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-surface/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="border-b border-white/[0.07] p-5 sm:p-7">
              <SectionTitle
                step="Step 1"
                title="Choose languages"
                icon={<Languages className="h-5 w-5 text-muted-foreground" />}
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <LanguageSelect
                  label="Translate from"
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  includeAuto
                  disabled={busy}
                />
                <button
                  type="button"
                  aria-label="Swap languages"
                  disabled={busy || sourceLanguage === "auto"}
                  onClick={() => {
                    setSourceLanguage(targetLanguage);
                    setTargetLanguage(sourceLanguage);
                  }}
                  className="grid h-11 w-full place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-brand/40 hover:text-foreground disabled:opacity-40 sm:w-11"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <LanguageSelect
                  label="Translate to"
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  disabled={busy}
                />
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <SectionTitle step="Step 2" title="Upload your document" />
              <AnimatePresence mode="wait">
                {(state === "idle" || state === "dragging") && (
                  <motion.label
                    key="dropzone"
                    initial={false}
                    animate={{ opacity: 1 }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setState("dragging");
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setState("idle");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setState("idle");
                      if (e.dataTransfer.files[0])
                        void handleFile(e.dataTransfer.files[0]);
                    }}
                    className={`group flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-all ${state === "dragging" ? "border-brand bg-brand/10" : "border-white/15 bg-white/[0.02] hover:border-brand/50 hover:bg-brand/[0.04]"}`}
                  >
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        void handleFile(e.target.files[0])
                      }
                    />
                    <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-brand/20 bg-brand/10 text-brand shadow-lg shadow-brand/10 transition-transform group-hover:-translate-y-1">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-semibold">Drop PDF here</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      or{" "}
                      <span className="font-medium text-brand">
                        browse from your computer
                      </span>
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <Pill>PDF only</Pill>
                      <Pill>Up to 50 MB</Pill>
                      <Pill>Maximum 200 pages</Pill>
                    </div>
                  </motion.label>
                )}
                {busy && (
                  <ProgressState
                    fileName={fileName}
                    fileSize={fileSize}
                    progress={progress}
                    state={state}
                    reset={reset}
                  />
                )}
                {state === "success" && (
                  <ResultState
                    success
                    message="The document has been processed successfully. Download it now or translate another file."
                    title="Your translated PDF is ready"
                    primary="Download PDF"
                    primaryAction={() =>
                      downloadUrl && window.open(downloadUrl, "_blank")
                    }
                    secondaryAction={reset}
                  />
                )}
                {state === "error" && (
                  <ResultState
                    message={errorMessage}
                    title="We couldn't process that file"
                    primary="Try again"
                    primaryAction={reset}
                  />
                )}
              </AnimatePresence>
            </div>
          </section>
          <aside className="space-y-5 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-white/[0.08] bg-surface/60 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand" />
                <h2 className="font-semibold">What happens next</h2>
              </div>
              <ol className="mt-5 space-y-5">
                <Info icon={FileText} title="Document analysis">
                  We inspect readable text and page structure.
                </Info>
                <Info icon={Languages} title="Contextual translation">
                  Content is translated page by page.
                </Info>
                <Info icon={FileOutput} title="PDF reconstruction">
                  A clean translated PDF is generated.
                </Info>
              </ol>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-surface/60 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="font-semibold">Private by design</h2>
              </div>
              <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
                <LockKeyhole className="h-4 w-4 shrink-0" />
                Uploaded directly to your configured API.
              </p>
            </div>
            <p className="px-2 text-xs leading-5 text-muted-foreground">
              Scanned PDFs without selectable text require OCR, which is not yet
              available.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

function createRequestSignal(
  controllerSignal: AbortSignal,
  timeoutMs: number,
): AbortSignal {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.any === "function" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return AbortSignal.any([controllerSignal, AbortSignal.timeout(timeoutMs)]);
  }

  const timeoutController = new AbortController();
  const timer = setTimeout(() => {
    timeoutController.abort(
      new DOMException("The operation timed out.", "TimeoutError"),
    );
  }, timeoutMs);

  controllerSignal.addEventListener(
    "abort",
    () => {
      clearTimeout(timer);
      timeoutController.abort(controllerSignal.reason);
    },
    { once: true },
  );

  return timeoutController.signal;
}

async function getApiError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as {
    message?: string;
    detail?: string | Array<{ msg?: string }>;
  } | null;
  const detail = Array.isArray(body?.detail)
    ? body.detail
        .map((item) => item.msg)
        .filter(Boolean)
        .join(", ")
    : body?.detail;

  if (body?.message) return body.message;
  if (detail) return detail;

  if (response.status === 404) {
    return "Cannot reach the translation API endpoint (HTTP 404). Please ensure the backend server is running.";
  }
  return `${fallback} (HTTP ${response.status})`;
}

function LanguageSelect({
  label,
  value,
  onChange,
  includeAuto = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  includeAuto?: boolean;
  disabled?: boolean;
}) {
  const options = includeAuto
    ? languages
    : languages.filter(([code]) => code !== "auto");
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <select
          aria-label={label}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-background/70 px-4 pr-10 text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
        >
          {options.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}
function SectionTitle({
  step,
  title,
  icon,
}: {
  step: string;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
          {step}
        </p>
        <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      </div>
      {icon}
    </div>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 px-3 py-1.5">
      {children}
    </span>
  );
}
function ProgressState({
  fileName,
  fileSize,
  progress,
  state,
  reset,
}: {
  fileName: string | null;
  fileSize: string | null;
  progress: number;
  state: UploadState;
  reset: () => void;
}) {
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
    >
      <div className="flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{fileName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{fileSize}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cancel translation"
          onClick={reset}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-8 flex justify-between text-sm">
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          {state === "uploading"
            ? "Uploading securely"
            : "Translating your document"}
        </span>
        <b>{progress}%</b>
      </div>
      <Progress value={progress} className="mt-3 h-2.5 bg-white/[0.06]" />
    </motion.div>
  );
}
function ResultState({
  success = false,
  title,
  message,
  primary,
  primaryAction,
  secondaryAction,
}: {
  success?: boolean;
  title: string;
  message: string;
  primary: string;
  primaryAction: () => void;
  secondaryAction?: () => void;
}) {
  return (
    <motion.div
      key={success ? "success" : "error"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-7 text-center sm:p-10 ${success ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-destructive/20 bg-destructive/[0.04]"}`}
    >
      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${success ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}
      >
        {success ? (
          <CheckCircle2 className="h-8 w-8" />
        ) : (
          <X className="h-8 w-8" />
        )}
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {message}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          variant={success ? "brand" : "outline"}
          size="lg"
          onClick={primaryAction}
        >
          {primary}
          {success && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        {secondaryAction && (
          <Button variant="outline" size="lg" onClick={secondaryAction}>
            Translate another
          </Button>
        )}
      </div>
    </motion.div>
  );
}
function Info({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {children}
        </span>
      </span>
    </li>
  );
}
