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
  
## <a name="contributing"></a> Contributing workflow

1. Clone or fork this repository
2. Run `npm install` in the part-up root folder (you will need Node for this, make sure it is installed)
3. Create a **feature** (`feat-...` or `ft-`) or **fix** (`fix-...`) branch: (git checkout -b _branchname_)
4. Complete a feature or bug
5. Try to create tests for the feature or bug, see [testing](#testing) for details
6. Commit changes with `npm run commit` (in the part-up root folder) to automatically follow [our commit guidelines](#commit).
7. Push the branch
8. Create a pull request

## Code formatting

We use linting following the Airbnb rule set to keep the code base clean and maintainable. You can use this by [installing a linter](https://guide.meteor.com/code-style.html#eslint-editor) to your editor. The linter will run while you code and help with format practices, besides realtime linting we also run the linter when commiting with `npm run commit` so you can see if you've missed anything.

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted for maintenance of the change log and
semantic versioning.  This leads to **more readable messages** that are easy to follow when looking through the
**project history**.  But also, we use the git commit messages to **generate the change log**.

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
The scope could be anything specifying place of the commit change. For example `$collections`,
`$server`, `$client`, `$schema`, `$mobile`, etc...

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

#### Example of a commit message

Appears under "Features" header, $schema sub header:

```
feat($schema): change 'tribe_admin' allowed character size
```

## <a name="testing"></a> Testing

### Unit tests

We use [Tinytest](github.com/numtel/tinytest-in-app) to unit test code that exists in our local meteor packages that does not touch the UI, like the `partup-lib` package.

1. Create a test file in the same folder as the code you want to test, e.g. `files.js` & `files.test.js`
1. Add the test file to `Package.onTest()` in the packages `package.js` file
1. Run the tests by *from the `app` directory* typing `meteor test-packages package-name` or `meteor test-packages ./`

You can find an example of tests in `app/packages/partup-lib/files`.

### Integration tests

Some integration tests exists, but are not fully functional. We use cucumber. See `app/tests/cucumber`. We could really use some help writing tests!
