import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dedent(str: string): string {
  return str
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n')
    .trim();
}
