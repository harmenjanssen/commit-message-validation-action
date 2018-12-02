console.log('hello world');
console.dir(process.env);

const { exec } = require('child_process');

exec(`git log --format=%B -n 1 ${process.env.GITHUB_SHA}`, (err, stdout) => {
  console.log(
    stdout
  );


});
