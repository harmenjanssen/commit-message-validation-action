# Commit message validation action

Github action for validating commit messages.

Note that this is an opinionated package, following wholly arbitrary preferences.

## Usage 

You can save the following in your repo as `/.github/workflows/validate-commit-message.yml`:

```yml
on: push
name: Validate commit message
jobs:
  build:
    name: Validate
    runs-on: ubuntu-latest
    steps:
      - name: Validate
        uses: harmenjanssen/commit-message-validation-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## How does this work?

This action performs the following checks on every commit message:

- Commit message should start with an uppercase letter.
- Subject line should not exceed 72 characters.
- Commit should start with an imperative verb.
- Commit message should not contain rebase instructions like `!fixup` or `!squash`.

### Examples

Examples of valid commit messages are:

```
Add colorpicker to admin interface
Update README.md
Remove deprecated function
```

## Contribution

Pull Requests are welcome! 

Please make sure the tests pass and add a test that shows which problem your contribution is solving.

### Tests

Run the tests using 

```
$ npm run test
```
