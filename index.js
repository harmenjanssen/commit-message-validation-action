console.log('hello world');
console.dir(process.env);

const { execSync } = require('child_process');

const stdout = execSync(`git log --format=%B -n 1 ${process.env.GITHUB_SHA}`);
console.log(
  stdout
);

