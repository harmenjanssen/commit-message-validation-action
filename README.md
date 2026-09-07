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
- Commit should start with an imperative verb, in English or Dutch.
- Commit message should not contain rebase instructions like `!fixup` or `!squash`.

Both languages are always accepted; there is nothing to configure.

English verbs are recognised through [WordNet](https://wordnet.princeton.edu/), so
anything WordNet knows as a verb will pass. Dutch has no comparable lexicon available,
and its imperative is the bare verb stem, which overlaps with many nouns. Dutch is
therefore validated against a fixed list in
[`lib/dutch-imperatives.js`](lib/dutch-imperatives.js) — open a PR if a verb you need
is missing.

When the first word is close to an allowed imperative, the error message says so:
`Fixed the bug` is rejected with *Did you mean "Fix"?*

### Examples

Examples of valid commit messages are:

```
Add colorpicker to admin interface
Update README.md
Remove deprecated function
```

The same in Dutch:

```
Voeg colorpicker toe aan de beheeromgeving
Werk README.md bij
Verwijder deprecated functie
```

## Contribution

Pull Requests are welcome! 

Please make sure the tests pass and add a test that shows which problem your contribution is solving.

### Tests

Run the tests using 

```
$ npm run test
```

### Build dist

To build your changes run:

```
$ npm run build
```

Commit the changes in `dist`.
