"use client";

import React, { useState, HTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div
      className={cn(
        "border border-border rounded-card bg-surface transition-colors shadow-xs overflow-hidden",
        isOpen && "border-primary/40 shadow-card",
        className
      )}
    >
      <h3>
        <button
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 font-bold text-foreground text-base md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 select-none hover:text-primary transition-colors"
        >
          <span className="leading-snug">{title}</span>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180 text-primary"
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className={cn(
          "px-4 md:px-5 pb-5 pt-1 text-sm md:text-base text-secondary leading-relaxed border-t border-border/50",
          !isOpen && "hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ className, children, ...props }: AccordionProps) {
  return (
    <div className={cn("space-y-3 w-full", className)} {...props}>
      {children}
    </div>
  );
}
