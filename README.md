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
