const WordPOS = require('wordpos');
const createOctokit = require('./lib/github.js');

const SUBJECT_MAXLENGTH = 72;

async function updateCommitStatus(octokit, owner, repo, commit_sha, options) {
  const { state, target_url, description, context } = options;
  console.log('Updating status for commit ' + commit_sha);
  const result = await octokit.repos.createStatus({owner, repo, commit_sha, state, target_url, description, context})
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

  const wordpos = new WordPOS();
  const isVerb = await wordpos.isVerb(firstWord);
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
    await updateCommitStatus(octokit, owner, repo, process.env.GITHUB_SHA, {
      state: 'success',
      context: 'harmenjanssen/commit-message-validation-action'
    });

    process.exit(0);
  } catch (err) {
    console.log(err);
    await updateCommitStatus(octokit, owner, repo, process.env.GITHUB_SHA, {
      state: 'failure',
      context: 'harmenjanssen/commit-message-validation-action',
      description: err
    });

    process.exit(1);
  }
}

main();
