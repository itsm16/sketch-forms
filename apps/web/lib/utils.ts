import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "node:crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
