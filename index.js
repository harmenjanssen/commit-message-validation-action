const createOctokit = require('./lib/github.js');
const validateMessage = require('./lib/validate-message.js');

async function main() {
  const octokit = createOctokit();
  const [ owner, repo ] = process.env.GITHUB_REPOSITORY.split('/');
  const commit = await octokit.git.getCommit({ owner, repo, commit_sha: process.env.GITHUB_SHA });
  try {
    await validateMessage(commit.data.message);
    console.log('This commit looks beautiful');
    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

main();
