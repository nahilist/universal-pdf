"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, FileText, X, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type UploadState = "idle" | "dragging" | "uploading" | "processing" | "success" | "error";

export default function TranslatePage() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("Please upload a valid PDF file.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (state === "dragging") setState("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a valid PDF file.");
      setState("error");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("The PDF must be smaller than 50 MB.");
      setState("error");
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setState("uploading");
    setProgress(20);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(`${apiUrl}/api/v1/files/upload`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(15_000),
      });
      if (!uploadResponse.ok) {
        const body = await uploadResponse.json().catch(() => null);
        throw new Error(body?.message ?? "The PDF upload failed.");
      }
      const upload = (await uploadResponse.json()) as { file_id: string };

      setProgress(25);
      setState("processing");

      const jobResponse = await fetch(`${apiUrl}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          file_id: upload.file_id,
          filename: file.name,
          source_language: "auto",
          target_language: "hi",
        }),
      });
      if (!jobResponse.ok) {
        const body = await jobResponse.json().catch(() => null);
        throw new Error(body?.message ?? "Could not create the translation job.");
      }

      let job = (await jobResponse.json()) as {
        id: string;
        status: string;
        progress: number;
        download_url?: string;
        error_message?: string;
      };

      while (job.status !== "COMPLETED") {
        if (job.status === "FAILED") {
          throw new Error(job.error_message ?? "Translation failed.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await fetch(`${apiUrl}/api/v1/jobs/${job.id}`, {
          signal: AbortSignal.timeout(15_000),
          cache: "no-store",
        });
        if (!statusResponse.ok) throw new Error("Could not read translation progress.");
        job = await statusResponse.json();
        setProgress((current) => Math.max(current, job.progress));
      }

      if (!job.download_url) throw new Error("The server did not provide a download link.");

      setProgress(100);
      setDownloadUrl(`${apiUrl}${job.download_url}`);
      setState("success");
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "TimeoutError"
          ? "The server took too long to respond. Restart the backend and try a smaller PDF."
          : error instanceof Error
            ? error.message
            : "Translation failed.";
      setErrorMessage(message);
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setFileName(null);
    setFileSize(null);
    setDownloadUrl(null);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Translate your document
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a PDF and we will preserve its structure while translating.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">English</span>
              <span className="text-xs text-muted-foreground">(auto-detected)</span>
            </div>
            <Languages className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Hindi</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state === "idle" || state === "dragging" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
                  state === "dragging"
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-brand/50 hover:bg-surface/50"
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Drop PDF here
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      or browse files
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF up to 200 pages, max 50MB
                  </p>
                </div>
              </motion.div>
            ) : null}

            {(state === "uploading" || state === "processing") && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-border/50 bg-surface/30 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileName}</p>
                    <p className="text-sm text-muted-foreground">{fileSize}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {state === "uploading" ? "Uploading..." : "Processing..."}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                {state === "processing" && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-muted-foreground">
                        PDF uploaded
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      <span className="text-sm text-muted-foreground">
                        Translating document page by page...
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {state === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-border/50 bg-surface/30 p-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Translation complete</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your translated PDF is ready for download.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="brand"
                    onClick={() => downloadUrl && window.open(downloadUrl, "_blank")}
                    disabled={!downloadUrl}
                  >
                    Download PDF
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Translate another
                  </Button>
                </div>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-border/50 bg-surface/30 p-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <X className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Upload failed</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {errorMessage}
                </p>
                <Button variant="outline" className="mt-6" onClick={reset}>
                  Try again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="success">Secure</Badge>
              End-to-end encrypted
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="success">Fast</Badge>
              Minutes, not hours
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="success">Accurate</Badge>
              Layout preserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
