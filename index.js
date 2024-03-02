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

    /////////////////////////////////////////////////////////////////////

    const branchCommit = commit.data.parents[0];
    const branch = branchCommit.parents.length === 0 ? branchCommit.sha : null; // Assuming it's a merge commit

    if (branch) {
      // Check if there is an open pull request for the branch
      const { data: openPullRequests } = await octokit.pulls.list({
        owner,
        repo,
        state: "open",
        head: `${owner}:${branch}`,
      });

      if (openPullRequests.length > 0) {
        console.log(
          `There is an open pull request for the branch ${branch}: #${openPullRequests[0].number}`
        );
      } else {
        console.log(`There is no open pull request for the branch ${branch}.`);
      }
    } else {
      console.log("Unable to determine the branch associated with the commit.");
    }

    return;

    /////////////////////////////////////////////////////////////////////

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
      console.log(`Adding comment to PR ${pullRequest.number}`);

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
