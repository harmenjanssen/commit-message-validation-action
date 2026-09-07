const DUTCH_IMPERATIVES = require('./dutch-imperatives.js');

// English imperatives we can suggest. WordNet holds over 11.000 verbs, but offers no
// way to enumerate them, so this covers the forms that actually go wrong in practice:
// a past tense where the imperative was meant.
const ENGLISH_IMPERATIVES = [
  'Add',
  'Allow',
  'Build',
  'Bump',
  'Change',
  'Check',
  'Close',
  'Create',
  'Delete',
  'Disable',
  'Document',
  'Drop',
  'Enable',
  'Extract',
  'Fix',
  'Handle',
  'Hide',
  'Implement',
  'Improve',
  'Include',
  'Introduce',
  'Make',
  'Merge',
  'Move',
  'Prevent',
  'Refactor',
  'Remove',
  'Rename',
  'Replace',
  'Restore',
  'Revert',
  'Set',
  'Show',
  'Simplify',
  'Split',
  'Support',
  'Update',
  'Upgrade',
  'Use'
];

// Short words are close to almost everything, so they get a stricter budget. Without
// this, a three-letter word picks up a confident but arbitrary suggestion.
const LONG_WORD_LENGTH = 5;
const MAX_DISTANCE_LONG = 2;
const MAX_DISTANCE_SHORT = 1;

// Levenshtein distance, built one row at a time from the previous row.
function distance(a, b) {
  const firstRow = Array.from({ length: b.length + 1 }, (_, index) => index);

  const lastRow = [...a].reduce(
    (previousRow, charA, i) =>
      [...b].reduce(
        (row, charB, j) => [
          ...row,
          Math.min(
            row[j] + 1, // insertion
            previousRow[j + 1] + 1, // deletion
            previousRow[j] + (charA === charB ? 0 : 1) // substitution
          )
        ],
        [i + 1]
      ),
    firstRow
  );

  return lastRow[b.length];
}

// Returns the closest allowed imperative, or null when nothing is close enough to be
// worth guessing.
module.exports = function suggestImperative(word) {
  const budget = word.length >= LONG_WORD_LENGTH ? MAX_DISTANCE_LONG : MAX_DISTANCE_SHORT;

  const [ best ] = [...DUTCH_IMPERATIVES, ...ENGLISH_IMPERATIVES]
    .map(candidate => ({
      candidate,
      distance: distance(word.toLowerCase(), candidate.toLowerCase())
    }))
    .filter(match => match.distance <= budget)
    .sort((a, b) => a.distance - b.distance);

  return best ? best.candidate : null;
};
