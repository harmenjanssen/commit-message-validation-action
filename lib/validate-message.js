const WordPOS = require('wordpos');

const SUBJECT_MAXLENGTH = 72;

// Arbitrary list of verbs not in the wordpos list.
const VERB_EXCEPTIONS = [
  'Refactor',
  // Although the following are not valid imperatives, they're also not recognized
  // by wordpos, resulting in a misleading error message.
  'Fixed',
  'Closed'
];

// Check whether a word is a verb
async function isVerb(word) {
  const wordpos = new WordPOS();
  const isVerb = await wordpos.isVerb(word);
  return isVerb || VERB_EXCEPTIONS.includes(word);
}

// Main validation function
module.exports = async function(message) {
  const [ subject ] = message.split("\n");

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
  const [ firstWord, restWords ] = subject.split(' ');
  if (!/^[A-Z]{1}/.test(firstWord)) {
    throw new Error('Subject does not start with an uppercase letter');
  }

  const startsWithVerb = await isVerb(firstWord);
  if (!startsWithVerb) {
    throw new Error('Subject does not seem to start with a verb');
  }

  if (/[bcdfghjklmnpqrstvwxz]+ed$/.test(firstWord)) {
    throw new Error('Subject does not seem to start with an imperative verb');
  }

  return true;
};
