const readPkg = require("read-pkg");
const { compose } = require("ramda");
const { withOnlyPackageCommits } = require("./only-package-commits");
const versionToGitTag = require("./version-to-git-tag");
const logPluginVersion = require("./log-plugin-version");
const { wrapStep } = require("semantic-release-plugin-decorators");

const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require("./options-transforms");

const analyzeCommits = wrapStep(
  "analyzeCommits",
  compose(logPluginVersion("analyzeCommits"), withOnlyPackageCommits),
  {
    wrapperName: "@rossmcewan/semantic-release-nx",
  }
);

const generateNotes = wrapStep(
  "generateNotes",
  compose(
    logPluginVersion("generateNotes"),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: "@rossmcewan/semantic-release-nx",
  }
);

const success = wrapStep(
  "success",
  compose(
    logPluginVersion("success"),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: "@rossmcewan/semantic-release-nx",
  }
);

const fail = wrapStep(
  "fail",
  compose(
    logPluginVersion("fail"),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: "@rossmcewan/semantic-release-nx",
  }
);

module.exports = {
  analyzeCommits,
  generateNotes,
  success,
  fail,
  tagFormat: readPkg.sync().name + "-v${version}",
};
