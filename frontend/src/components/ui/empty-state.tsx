import React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-neutral-300 rounded-2xl bg-surface">
      <FolderSearch className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-600 max-w-md mx-auto mt-1 mb-6">
        {description}
      </p>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
}
