const createOctokit = require('./lib/github.js');

async function validateMessage(owner, repo, commit_sha) {
  const octokit = createOctokit();
  try {
    const commit = await octokit.git.getCommit({ owner, repo, commit_sha });
    console.log(commit);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const [ owner, repo ] = process.env.GITHUB_REPOSITORY.split('/');
validateMessage(owner, repo, process.env.GITHUB_SHA);
