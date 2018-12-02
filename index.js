const createOctokit = require('./lib/github.js');

const github = createOctokit();
const { owner, repo } = process.env.GITHUB_REPOSITORY.split('/');
const commit = await octokit.git.getCommit({ owner , repo, commit_sha: process.env.GITHUB_SHA });

console.log(commit);
