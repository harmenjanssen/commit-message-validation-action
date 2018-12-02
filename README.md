# Commit message validation action

Github action for validating commit messages.


```
workflow "validate commit message action" {
  on = "pull_request"
  resolves = ["validate commit message"]
}

action "validate commit message" {
  uses = "harmenjanssen/commit-message-validation-action@master"
  secrets = ["GITHUB_TOKEN"]
}
```

This performs the following checks:

- Commit message should start with an uppercase letter.
- Subject line should not exceed 72 characters.
- Commit should start with an imperative verb.
- Commit message should not contain rebase instructions like `!fixup` or `!squash`.
