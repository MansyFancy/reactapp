import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in PKR format
export function formatCurrency(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Format date from ISO string to readable format
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get month name from date
export function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
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

// Get icon background color classes based on transaction type
export function getIconBgClass(type: string): string {
  switch (type) {
    case 'income':
      return 'bg-green-100 text-green-500';
    case 'expense':
      return 'bg-red-100 text-red-500';
    case 'savings':
      return 'bg-blue-100 text-blue-500';
    case 'extra':
      return 'bg-purple-100 text-purple-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}

// Get amount text color based on transaction type
export function getAmountTextClass(type: string): string {
  switch (type) {
    case 'income':
      return 'text-secondary';
    case 'expense':
      return 'text-accent';
    case 'savings':
      return 'text-blue-500';
    case 'extra':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
}

// Get previous months
export function getPreviousMonths(count: number): Date[] {
  const today = new Date();
  const months = [];
  
  for (let i = count - 1; i >= 0; i--) {
    const month = new Date(today);
    month.setMonth(today.getMonth() - i);
    months.push(month);
  }
  
  return months;
}
