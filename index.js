const createOctokit = require('./lib/github.js');

const SUBJECT_MAXLENGTH = 72;

async function validateMessage(owner, repo, commit_sha) {
  const octokit = createOctokit();
  try {
    const commit = await octokit.git.getCommit({ owner, repo, commit_sha });
    const [ subject ] = commit.data.message.split("\n");

    // Start off simple: check subject length
    if (subject.length > SUBJECT_MAXLENGTH) {
      console.error(`Subject exceeds maximum length of ${SUBJECT_MAXLENGTH} characters`);
      process.exit(1);
    }

    // Check artifacts of git commit --fixup or --squash
    const rebaseInstruction = /^(\!(?:fixup|squash))/.exec(subject);
    if (rebaseInstruction !== null) {
      console.error(`Commit includes rebase instruction: ${rebaseInstruction[0]}`);
      process.exit(1);
    }

    // Check whether the commit message starts with an imperative verb

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const [ owner, repo ] = process.env.GITHUB_REPOSITORY.split('/');
validateMessage(owner, repo, process.env.GITHUB_SHA);
