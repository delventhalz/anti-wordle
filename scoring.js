import { WORDS } from './words.js'

function countNested(nested) {
  let count = {};

  for (let iterable of nested) {
    for (let item of iterable) {
      if (count[item]) {
        count[item] += 1;
      } else {
        count[item] = 1;
      }
    }
  }

  return count;
}

/**
 * All letters with their frequency count.
 */
export const SCORES = countNested(WORDS);

/**
 * Scores a word based on the frequency that the included letters appear in
 * five-letter words. Repeated letters get a score of 0.
 *
 * @param {string} word - a word to score
 * @returns {number} - the score
 */
export function score(word) {
  let total = 0;
  let counted = new Set();

  for (let letter of word) {
    if (!counted.has(letter)) {
      total += SCORES[letter];
      counted.add(letter);
    }
  }

  return total;
}
