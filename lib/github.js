// Instantiate Octokit
const { Octokit } = require('@octokit/rest');

module.exports = () => new Octokit({ auth: process.env.GITHUB_TOKEN });
