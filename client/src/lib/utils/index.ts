export * from './format';

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get icon background color classes based on transaction type
export function getIconBgClass(type: string): string {
  switch (type) {
    case 'income':
      return 'bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400';
    case 'expense':
      return 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400';
    case 'savings':
    case 'saving':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400';
    case 'extra':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-400';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
  }
}

// Get amount text color based on transaction type
export function getAmountTextClass(type: string): string {
  switch (type) {
    case 'income':
      return 'text-green-600 dark:text-green-400';
    case 'expense':
      return 'text-red-600 dark:text-red-400';
    case 'savings':
    case 'saving':
      return 'text-blue-600 dark:text-blue-400';
    case 'extra':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

// Get random color from palette
export const colors = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F43F5E', // rose
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#06B6D4', // cyan
];

export function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}