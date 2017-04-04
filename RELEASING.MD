
# Release process for developers

For the release process we're using a gulp plugin for managing semver releases using conventional changelog.
Check plugin: [gulp-conventional-release](https://github.com/aaronroberson/gulp-conventional-release)

 1. Peer-review the code changes that have been made on the master branch. Any changes on master will have gone through
    a peer reviewed pull request, but think on what is in a release anyway :)
 1. Please check the [CHANGELOG](https://github.com/part-up/part-up/blob/master/RELEASING.MD) to understand the
    version management of this project.
    For more information about Semantic Versioning please take a look at: [semver.org](http://semver.org/)
 1. Run `npm run release` (this will stage and commit the changes, bump the version in package.json, run
    conventional-changelog to update the changelog,
    tag the version, and push the changes)
 1. After the push Jenkins will automatically build the tag release. Please go to [Jenkins](https://jenkins.part-up.com)
    to see the build. You can compare the build with the latest commit SHA.
 1. After the build is finished on Jenkins you can go to the **PROJECT_ROOT/devops** folder start to deploy an image tag
    to the **acceptance** server.
 1. Check your deployment on [acceptance](https://acceptance.part-up.com). Open your browser console and type:
    `Version.get()`
 1. If everything is OK, deploy your tag to production.
 1. Let the people of the part-up open source development community know that you've just made a new release by adding
    a new message on the part-up messages board.
 1. Generate GitHub release notes with    **(GitHub personal token is required)**.

  ``` lang=bash
  npm run release-notes
  ```

  See the [Release notes](https://github.com/part-up/part-up/releases).

  Steps to create GitHub Personal Token (skip the steps if you already have one)
  1. Go to [Create new token](https://github.com/settings/tokens/new)
  1. Fill in the token name `CONVENTIONAL_GITHUB_RELEASER_TOKEN` and check all the **repo** scope.
  1. Copy your generated token.
  1. Open your `~/.bash_profile` and add

  ``` lang=bash
  CONVENTIONAL_GITHUB_RELEASER_TOKEN=[YOUR COPIED TOKEN]
  ```
