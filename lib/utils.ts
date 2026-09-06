import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '0';
  const num = Math.round(typeof amount === 'string' ? parseFloat(amount) : amount);
  if (isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

