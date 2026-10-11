"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "./OnboardingProvider";

interface Props {
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
}

export function OpenOnboardingButton({ variant = "primary", size = "md", className, children }: Props) {
  const { open } = useOnboarding();
  return (
    <Button variant={variant} size={size} className={className} onClick={open} aria-haspopup="dialog">
      {children}
    </Button>
  );
}
