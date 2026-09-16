import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getRiskColorClass(score: number) {
  if (score < 40) return "text-risk-low";
  if (score < 70) return "text-risk-medium";
  return "text-risk-high";
}

export function getRiskBgClass(score: number) {
  if (score < 40) return "bg-risk-low/20 text-risk-low border-risk-low/30";
  if (score < 70) return "bg-risk-medium/20 text-risk-medium border-risk-medium/30";
  return "bg-risk-high/20 text-risk-high border-risk-high/30";
}
