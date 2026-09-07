const WordPOS = require('wordpos');
const DUTCH_IMPERATIVES = require('./dutch-imperatives.js');
const suggestImperative = require('./suggest-imperative.js');

const SUBJECT_MAXLENGTH = 72;

// Arbitrary list of verbs not in the wordpos list.
const VERB_EXCEPTIONS = [
  'Preselect',
  'Refactor',
  // Although the following are not valid imperatives, they're also not recognized
  // by wordpos, resulting in a misleading error message.
  'Fixed',
  'Closed'
];

// Check whether a word is a verb according to WordNet
async function isEnglishVerb(word) {
  const wordpos = new WordPOS();
  const isVerb = await wordpos.isVerb(word);
  return isVerb || VERB_EXCEPTIONS.includes(word);
}

// Dutch has no verb lexicon to consult, so the imperatives are enumerated instead.
function isDutchImperative(word) {
  return DUTCH_IMPERATIVES.includes(word);
}

function withSuggestion(message, word) {
  const suggestion = suggestImperative(word);
  return suggestion ? `${message}. Did you mean "${suggestion}"?` : message;
}

// Main validation function
module.exports = async function(message) {
  const [ subject ] = message.split("\n");

  // Allow version commits (made by `yarn publish` for example)
  if (/^v([0-9]|[1-9][0-9]*)\.([0-9]|[1-9][0-9]*)\.([0-9]|[1-9][0-9]*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/.test(subject)) {
    return true;
  }

  // Start off simple: check subject length
  if (subject.length > SUBJECT_MAXLENGTH) {
    throw new Error(`Subject exceeds maximum length of ${SUBJECT_MAXLENGTH} characters`);
  }

  // Check artifacts of git commit --fixup or --squash
  const rebaseInstruction = /^(\!(?:fixup|squash))/.exec(subject);
  if (rebaseInstruction !== null) {
    throw new Error(`Commit includes rebase instruction: ${rebaseInstruction[0]}`);
  }

  // Check whether the commit message starts with an imperative verb
  const [ firstWord ] = subject.split(' ');
  if (!/^[A-Z]{1}/.test(firstWord)) {
    throw new Error('Subject does not start with an uppercase letter');
  }

  // Dutch and English are equally valid; satisfying either one is enough.
  if (isDutchImperative(firstWord)) {
    return true;
  }

  const startsWithVerb = await isEnglishVerb(firstWord);
  if (!startsWithVerb) {
    throw new Error(withSuggestion('Subject does not seem to start with a verb', firstWord));
  }

  // Past tense detection is English morphology, so it only guards the English branch.
  if (/[bcdfghjklmnpqrstvwxz]+ed$/.test(firstWord)) {
    throw new Error(withSuggestion('Subject does not seem to start with an imperative verb', firstWord));
  }

  return true;
};
