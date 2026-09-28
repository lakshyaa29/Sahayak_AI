import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChecklistItemProps {
  id: string;
  title: string;
  description?: string;
  mandatory?: boolean;
  category?: string;
  checked?: boolean;
  completed?: boolean;
  badgeText?: string;
  onToggle: (id: string, completed: boolean) => void;
  className?: string;
}

export function ChecklistItem({
  id,
  title,
  description,
  mandatory = false,
  category,
  checked,
  completed,
  badgeText,
  onToggle,
  className,
}: ChecklistItemProps) {
  const isResolved = completed ?? checked ?? false;

  const handleToggle = () => {
    onToggle(id, !isResolved);
  };

  return (
    <div
      onClick={handleToggle}
      role="checkbox"
      aria-checked={isResolved}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={cn(
        "p-4 rounded-card border transition-all duration-150 cursor-pointer select-none flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isResolved
          ? "bg-primary/5 border-primary shadow-xs"
          : "bg-surface border-border hover:border-input-border hover:bg-neutral-50/50",
        className
      )}
    >
      <div className="mt-0.5 text-primary flex-shrink-0">
        {isResolved ? (
          <CheckSquare className="w-5 h-5 fill-primary text-white" />
        ) : (
          <Square className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "text-sm font-bold",
              isResolved ? "text-primary line-through" : "text-foreground"
            )}
          >
            {title}
          </span>
          {badgeText ? (
            <Badge variant="primary" className="text-[10px] py-0 px-2">
              {badgeText}
            </Badge>
          ) : (
            <Badge variant={mandatory ? "primary" : "neutral"} className="text-[10px] py-0 px-2">
              {mandatory ? "Mandatory" : "Supporting"}
            </Badge>
          )}
          {category && (
            <span className="text-[11px] text-muted-foreground font-mono">
              Category: {category}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
