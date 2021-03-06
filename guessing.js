import { WORDS, COMMON_WORDS } from './words.js'
import { score } from './scoring.js'

function anyChar(str, predicate) {
  for (let i = 0; i < str.length; i += 1) {
    if (predicate(str[i], i, str)) {
      return true;
    }
  }

  return false;
}

function allChar(str, predicate) {
  for (let i = 0; i < str.length; i += 1) {
    if (!predicate(str[i], i, str)) {
      return false;
    }
  }

  return true;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Accepts currently known and eliminated letters and produces the optimal
 * next guess.
 *
 * Known letters should be passed as an object, with the letters as keys,
 * and an array of possible zero-indexed locations as values.
 *
 * Eliminated letters should be passed as an array.
 *
 * @param {Object.<string, number[]>} known - known letters
 * @param {string[]} eliminated - letters which have been eliminated
 * @returns {string} - the guess
 */
export function guess(known, eliminated) {
  let words = [...WORDS];

  if (eliminated.length > 0) {
    let invalid = new Set(eliminated);
    words = words.filter(word => !anyChar(word, char => invalid.has(char)));
  }

  let knownEntries = Object.entries(known);

  if (knownEntries.length > 0) {
    let valid = knownEntries.map(([letter]) => letter);
    words = words.filter(word => valid.every(char => word.includes(char)));
  }

  for (let [letter, locations] of knownEntries) {
    words = words.filter(word => allChar(word, (char, i) => {
      return char !== letter || locations.includes(i);
    }));
  }

  if (words.length === 0) {
    return null;
  }

  let scored = words.map(word => [word, score(word)]);
  let highScore = scored
    .map(([_, score]) => score)
    .sort((a, b) => b - a)
    [0];

  let guesses = scored
    .filter(([_, score]) => score === highScore)
    .map(([word]) => word);

  let commonGuesses = guesses.filter(word => COMMON_WORDS.has(word));
  if (commonGuesses.length > 0) {
    return randomItem(commonGuesses);
  }

  return randomItem(guesses);
}
