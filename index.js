const createOctokit = require('./lib/github.js');

async function validateMessage(owner, repo, commit_sha) {
  const github = createOctokit();
  const commit = await octokit.git.getCommit({ owner , repo, commit_sha });
  console.log(commit);
}

const { owner, repo } = process.env.GITHUB_REPOSITORY.split('/');
validateMessage(owner, repo, process.env.GITHUB_SHA);
