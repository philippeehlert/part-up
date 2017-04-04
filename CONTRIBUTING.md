# Contributing to part-up.com

This guideline details the preferred way of making contributions to the part-up.com codebase. If you have any questions,
please [join the conversation of the Platform Development tribe on Part-up](https://part-up.com/tribes/development/chat).

## Branches
- `master`: the main branch and the only one from which is deployed to acceptance, beta and production. Releases are
  referenced using git tags. No direct commits on master are allowed. Instead, all commits are done on feature branches
  and are peer reviewed before being merged into master.
- all other branches are considered feature/fix branches.

## Feature branches

- Always create a feature branch with a descriptive name (e.g., `git checkout -b feat-notifications`) when developing  
  features. Push new commits to your branch only.
- Keep your branch up to date with the latest commits on the master branch by occassionally merging in changes
  `git merge master`.
- When you are finished with your functionality, rebase the branch onto the latest commit of `master` using the command
  `git rebase origin/master` and create a pull request.
- When an integrator is satisfied with the branch and all feedback is processed, the integrator merges the feature
  branch into `master` using `git merge --no-ff feat-notifications`.

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted for maintenance of the change log and
semantic versioning.  This leads to **more readable messages** that are easy to follow when looking through the
**project history**.  But also, we use the git commit messages to **generate the change log**.


## Contributing workflow

**Make sure you run `npm install`**  (part-up root folder).

1. Create a **feature** (`feat-...` or `ft-`) or **fix** (`fix-...`) branch
2. Complete a feature or bug
3. Commit changes with `npm run commit` (part-up root folder) and choose one of the following options:

<div>
<img src="https://raw.githubusercontent.com/commitizen/cz-cli/master/meta/screenshots/add-commit.png" />
</div>

*If you do not follow the convention you will not be able to commit your work!
We have git-pre hooks built-in to ensure you're committing the code according to conventional format.*

4. Push
5. Create PR


### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference github issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

#### Examples

Appears under "Features" header, pencil sub header:

```
feat(pencil): add 'graphiteWidth' option
```

Appears under "Bug Fixes" header, graphite sub header, with a link to issue #GSNP-28:

```
fix(graphite): stop graphite breaking when width < 0.1

Closes #123
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for
performance reason.
```

The following commit and commit `667ecc1` do not appear in the change log if they are under the same release. If not,
the revert commit appears under the "Reverts" header.

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```
