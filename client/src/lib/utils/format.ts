// Format currency in PKR format
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
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

// Get previous months for charts
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