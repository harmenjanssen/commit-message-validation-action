const createOctokit = require("./lib/github.js");
const validateMessage = require("./lib/validate-message.js");

async function main() {
  const octokit = createOctokit();
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const commit = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: process.env.GITHUB_SHA,
  });
  try {
    await validateMessage(commit.data.message);
    console.log("\n\nThis commit looks beautiful\n\n");
    process.exit(0);
  } catch (err) {
    // Extract the SHA of the commit
    const commitSha = commit.data.sha;
    const [commitSubject] = commit.data.message.split("\n");

    // Get the pull requests that contain the commit
    const { data: pullRequests } = await octokit.pulls.list({
      owner,
      repo,
      sha: commitSha,
    });
    console.log(
      `Found ${pullRequests.length} pull requests for commit ${commitSha}`
    );

    // Loop through each pull request and add a comment.
    for (const pullRequest of pullRequests) {
      if (pullRequest.state !== "open") {
        console.log(
          `Skipping Pull Request ${pullRequest.number} because it is not open but ${pullRequest.state}`
        );
        continue;
      }
      const pullRequestNumber = pullRequest.number;

      await octokit.issues.createComment({
        owner,
        repo,
        number: pullRequestNumber,
        body: `Oh no! It looks like the commit message of ${commitSha} is invalid.\n
          Please update it to match the conventional commit format.\n\n

          The message was: \n
          > ${commitSubject}.\n\n

          Here is the error: ${err.message}`,
      });
    }

    console.log(`\n\n${err.message}\n\n`);
    process.exit(1);
  }
}

main();
