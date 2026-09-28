import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-10 px-4 border border-error-100 rounded-2xl bg-error-50/30">
      <AlertCircle className="w-10 h-10 text-error-700 mx-auto mb-2" />
      <h3 className="text-base font-bold text-error-800">{title}</h3>
      <p className="text-sm text-neutral-700 max-w-md mx-auto mt-1 mb-5">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
