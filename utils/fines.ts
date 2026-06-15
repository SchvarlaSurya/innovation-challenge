/**
 * utils/fines.ts
 *
 * Core business logic for calculating fines per confiscation.
 *
 * Rules:
 * - Offense count per class tracked in `class_warnings.offense_count`.
 * - First confiscation for a class → status: WARNING (no fine yet).
 * - Second confiscation onwards → status: FINED (Rp5.000 per item).
 */

/** Fine amount per item in Rupiah */
export const FINE_PER_ITEM = 5000;

/**
 * Determine the status and fine amount for a new confiscation.
 *
 * @param currentOffenseCount - Number of previous confiscations for this class (from class_warnings).
 * @param quantity - Number of items confiscated.
 * @returns { status, fineAmount }
 */
export function calculateFine(
  currentOffenseCount: number | null,
  quantity: number,
): { status: 'warning' | 'fined'; fineAmount: number } {
  // First offense ever → WARNING, no fine
  if (!currentOffenseCount || currentOffenseCount === 0) {
    return { status: 'warning', fineAmount: 0 };
  }

  // Second offense onwards → FINED
  return {
    status: 'fined',
    fineAmount: FINE_PER_ITEM * quantity,
  };
}

/**
 * Check if a class has already received a warning (i.e., offense_count >= 1).
 */
export function hasReceivedWarning(offenseCount: number | null): boolean {
  return offenseCount !== null && offenseCount >= 1;
}

/**
 * Calculate the total unpaid fine for a class based on all its confiscations.
 * Sum of all fine_amount where status !== 'resolved'.
 */
export function calculateTotalUnpaid(items: { status: string; fine_amount: number }[]): number {
  return items
    .filter((item) => item.status !== 'resolved')
    .reduce((sum, item) => sum + item.fine_amount, 0);
}
