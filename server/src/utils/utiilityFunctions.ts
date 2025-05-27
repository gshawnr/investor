/*
 * Utility functions for date comparisons.
 * These functions are used to compare dates in string format yyyy-mm-dd.
 */
export const isNewerThan = (
  currentDate: string,
  candidateDate: string
): boolean => {
  return new Date(currentDate) < new Date(candidateDate);
};
