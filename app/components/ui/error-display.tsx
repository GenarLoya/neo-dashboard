import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";

export interface ErrorDisplayProps {
  className?: string;
  error?: Error | unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

export function ErrorDisplay({
  className,
  error,
  title = "Something went wrong",
  message,
  onRetry,
  showIcon = true,
}: ErrorDisplayProps) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : "An unexpected error occurred");

  return (
    <div
      className={cn(
        "fade-in flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-card p-8 text-center shadow-sm",
        className,
      )}
    >
      {showIcon && (
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function ErrorDisplayCompact({
  className,
  error,
  message,
}: Pick<ErrorDisplayProps, "className" | "error" | "message">) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : "An unexpected error occurred");

  return (
    <div
      className={cn(
        "fade-in flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm",
        className,
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
      <p className="text-foreground">{errorMessage}</p>
    </div>
  );
}
