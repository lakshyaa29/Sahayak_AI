"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ResetConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-surface border border-border rounded-dialog p-6 shadow-elevated space-y-5"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 id="reset-dialog-title" className="text-lg font-bold text-foreground">
              {title}
            </h3>
            <p id="reset-dialog-desc" className="text-sm text-secondary mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <Button
            ref={cancelBtnRef}
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-error hover:bg-error-hover text-white border-transparent"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
