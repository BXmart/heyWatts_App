export function calculatePercentageChange(a: number, b: number): string {
  if (a === b) {
    return '100'
  }

  const totalDifference = a - b;
  const percetageDifference = (totalDifference / Math.abs(b)) * 100;
  return percetageDifference.toFixed(2);
}