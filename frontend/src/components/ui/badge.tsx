import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-brand text-brand-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    success: "border-transparent bg-emerald-500/10 text-emerald-400",
    warning: "border-transparent bg-amber-500/10 text-amber-400",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground border-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
