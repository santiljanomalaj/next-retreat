## Table of Contents
- [Contribution guidelines and best practices](#contribution-guidelines-and-best-practices)
  - [Why even bother?](#why-even-bother)
  - [Our Workflow](#our-workflow)
  - [1. It starts with an Issue](#1-it-starts-with-an-issue)
  - [2. Create a local branch](#2-create-a-local-branch)
  - [3. Commit, commit, commit](#3-commit-commit-commit)
  - [4. Make a Pull Request](#4-make-a-pull-request)
  - [5. Rebase if appropriate](#5-rebase-if-appropriate)
  - [6. Merge if...](#6-merge-if)

# Contribution guidelines and best practices

## Why even bother?

Git - the version control system is not merely a cloud-based backup for code, but - if used wisely - a powerful tool to make developer's life better. Even more so, when there's entire team of devs collaborating on a project.

An effective git / GitHub workflow has multiple benefits:

- fast orientation in project's history
- concise file history, with the ability to see who, when and how changed the code even on a line-by-line basis
- easier debugging
- easily reversible changes
- ...

However, some kind of standardized workflow has to come into play to achieve this.

## Our Workflow

Our git / GitHub workflow consists of couple of steps:

1. It starts with an Issue
2. Create a local branch
3. Commit, commit, commit
4. Make a Pull Request
5. Rebase if appropriate
6. Merge if...

Let's explore it one by one.

---

## 1. It starts with an Issue

**An Issue represents a single task to be done.** Think of it like an item in a To-Do list.

You can either have an Issue already assigned to you, or you can create a new one.

If you are creating an issue, make sure to follow this recommendation:

A good issue consists of
- **Issue Title:**
  - use descriptive title, that
    - **points to the problem location in the app,** and
    - **states what needs to be done.**
  - use dash ` - ` to separate "where" from "what"
  - **bad:** ~~"Create folder or list/segment style"~~
  - **good:** "Create new subscribers folder - align buttons"
- **Issue Description:**
  - any additional information, links, images - whatever helps to understand and eventually solve the issue
  - in the case of "Subscribers: create new folder - align buttons", there was a screenshot showing the problematic area
- **Assignees:**
  - you either
    - assign the issue either directly to someone,
    - assign it to more people, in which case **one of them should take up the issue and unassign others.**
    - give it an `Status: Up for grabs` label, so anybody can take it up.
- **Labels:**
  - labels help categorizing issues and improve orientation. Here's a list of all available labels along with their meaning:
    - `Status: Blocked` means the progress on this issue is blocked by external dependency/force
    - `Status: Duplicate` means the issue is the same as the one already opened
    - `Status: Feedback needed` means that assignee needs your opinion
    - `Status: In progress` means that assignee has started to work on the issue
    - `Status: Rejected` means the issue was rejected due to reason specified by the last comment e.g. duplicated, already solved somewhere else
    - `Status: Review needed` means the issue is addressed by a Pull Request, that will eventually close it
    - `Status: Testing` means the issue is for test-related things
    - `Status: Up for grabs` means anybody can pick it up; usually issues such labelled have nobody assigned
    - `Type: Bug` means the issue is a bug
    - `Type: Development` means the issue is for development-related things e.g. documentation, libraries
    - `Type: Enhancement` means the issue improves existing feature
    - `Type: Feature` means the issue is a new feature
    - `Deploy target: <version>` means in which version the issue will be deployed
  - **Project**
  - **Milestone**
    - milestones are groups of Issues with a set deadline
    - milestones are discussed and set on weekly calls, and in general, you won't have to touch them at all

When creating a new issue which is not connected to you directly, leave `Assignees` and `Labels` empty.
Do not work on issues with no sprint assigned.

---

## 2. Create a local branch

⚠️ You should never commit directly to `develop` branch.

We use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model, which (apart from many things) suggests using `hotfix`, `bugfix` and `feature` branch prefixes for development.

So if you are
- ✅ **doing general development - working on a feature or fixing bug**, branch off of development branch, and start your branch name with `feature/`.
- ⚠️ **fixing a SEMI-CRITICAL bug on TEST**, branch off of the latest release branch (`release/*`), and start your branch name with `bugfix/`
- 🌋 **fixing a CRITICAL bug on PRODUCTION**, branch off of production, and start your branch name with `hotfix/`

As an added benefit, most git GUIs can display such prefixed branches in folder-like structure, prefix being the folder name.

---

## 3. Commit, commit, commit

**Read this:** [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

- **commit when you have reached a codebase state you want to remember**
- treat commits like logical and self-contained units of work, such that
  - one commit may include changes in multiple files when they're closely related, but
  - strive for small commits (they're most useful that way)
- **Write a good commit title**
  - use imperative form (Bad: ~~`fixes a typo`~~; Good: `Fix a typo`)
    - [Why?](https://stackoverflow.com/a/3580764/2936363)
  - begin with an uppercase verb (`Fix` / `Add` / `Change` / `Remove` / `Refactor` / ...)

Don't forget to push your branch to the remote, so you can follow up with the next step.

---

## 4. Make a Pull Request

A Pull Request (PR) should ideally be named after the Issue it addresses.

However, there might be cases where the changes you make are much more exhaustive than the Issue they fix (e.g. an Issue "Make content scrollable on small devices" might require a refactor of current layout implementation). In this case it's better to name the PR after the changes you make, instead of after an Issue/s it closes.

Furthermore, make use of GitHub's [Closing Keywords](https://help.github.com/articles/closing-issues-using-keywords/) in your PR's description:

> You can include keywords in your pull request descriptions, as well as commit messages, to automatically close issues in GitHub.
> The following keywords, followed by an issue number, will close the issue:
>
> - close
> - closes
> - closed
> - fix
> - fixes
> - fixed
> - resolve
> - resolves
> - resolved
>
> For example, to close an issue numbered 123, you could use the phrase "Closes #123" or > "Closes: #123" in your pull request description or commit message. Once the branch is merged into the default branch, the issue will close.

Reviewers are added automatically thanks to the [CODEOWNERS](https://help.github.com/articles/about-codeowners/), so you don't need to worry about it.

Once you submit your PR, don't forget to add `ready for review` label to signalize other devs they can review your changes.

If you work on something on the PR, change the label to `in progress` to prevent others from reviewing code that you are in process of changing.

After you address reviewer's suggestion / comment, always leave a reply with the hash of the commit containing your changes e.g. `300c2ab`. This way reviewers can quickly see and check your implementation.

And last but not least, do not add milestones to the PR, they are only for the Issues.

---

## 5. Rebase if appropriate

Commits with name like `WIP` should **never** make it to the main branch - they're not helpful at all.

If your branch has commits like that, or other commits that don't have a reason to exist separately, you should **squash them into fewer commits (or even one) with [interactive rebase](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history)**.

If you want to save your work-in-progress, use [git stash](https://git-scm.com/book/en/v1/Git-Tools-Stashing) feature.

If there is a serious reason (eg. half-done change, that needs to get into the main branch), always include a sensible commit title after the `wip` prefix.

---

## 6. Merge if...

...at least 2 people approved your PR.

⚠️ Only the creator of PR can merge it to prevent issues with translations.

Don't forget to **delete the branch after it's merged**, to keep it clean & tidy around here.

---
