export type SRSResult = {
  interval: number; // in days
  repetitions: number;
  easinessFactor: number;
};

/**
 * Calculates the next review schedule using the SuperMemo-2 (SM-2) algorithm.
 * 
 * @param grade User grade (0-5)
 *  0 - Complete blackout
 *  1 - Incorrrect response; the correct one remembered
 *  2 - Incorrect response; where the correct one seemed easy to recall
 *  3 - Correct response recalled with serious difficulty
 *  4 - Correct response after a hesitation
 *  5 - Perfect recall
 * 
 * @param currentInterval Current interval in days
 * @param currentRepetitions Current number of successful repetitions
 * @param currentEf Current Easiness Factor
 */
export function calculateSRS(
  grade: number,
  currentInterval: number,
  currentRepetitions: number,
  currentEf: number
): SRSResult {
  let nextInterval: number;
  let nextRepetitions: number;
  let nextEf: number;

  if (grade >= 3) {
    // Correct response
    if (currentRepetitions === 0) {
      nextInterval = 1;
    } else if (currentRepetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(currentInterval * currentEf);
    }
    nextRepetitions = currentRepetitions + 1;
  } else {
    // Incorrect response
    nextInterval = 1;
    nextRepetitions = 0;
  }

  // Update Easiness Factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEf = currentEf + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  // EF constraint
  if (nextEf < 1.3) {
    nextEf = 1.3;
  }

  return {
    interval: nextInterval,
    repetitions: nextRepetitions,
    easinessFactor: nextEf,
  };
}
