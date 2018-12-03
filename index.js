const WordPOS = require('wordpos');
const createOctokit = require('./lib/github.js');

const SUBJECT_MAXLENGTH = 72;

// Arbitrary list of verbs not in the wordpos list.
const VERB_EXCEPTIONS = [
  'refactor',
  // Although "fixed" is not a valid imperative, it's also not recognized by wordpos,
  // resulting in a misleading error message.
  'fixed'
];

async function isVerb(word) {
  const wordpos = new WordPOS();
  const isVerb = await wordpos.isVerb(word);
  return isVerb || VERB_EXCEPTIONS.includes(word);
}

async function validateMessage(octokit, owner, repo, commit_sha) {
  const commit = await octokit.git.getCommit({ owner, repo, commit_sha });
  const [ subject ] = commit.data.message.split("\n");

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

  const isVerb = await isVerb(firstWord);
  if (!isVerb) {
    throw new Error('Subject does not seem to start with a verb');
  }

  if (/[bcdfghjklmnpqrstvwxz]+ed$/.test(firstWord)) {
    throw new Error('Subject does not seem to start with an imperative verb');
  }

}

async function main() {
  const octokit = createOctokit();
  const [ owner, repo ] = process.env.GITHUB_REPOSITORY.split('/');
  try {
    await validateMessage(octokit, owner, repo, process.env.GITHUB_SHA);
    console.log('This commit looks beautiful');
    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

main();
