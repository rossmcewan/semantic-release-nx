import { readPackage } from 'read-pkg';
import { compose } from 'ramda';
import { withOnlyPackageCommits } from './only-package-commits.js';
import versionToGitTag from './version-to-git-tag.js';
import { logPluginVersion } from './log-plugin-version.js';
import { wrapStep } from 'semantic-release-plugin-decorators';
import {
  mapNextReleaseVersion,
  withOptionsTransforms,
} from './options-transforms.js';

export const analyzeCommits = wrapStep(
  'analyzeCommits',
  compose(logPluginVersion('analyzeCommits'), withOnlyPackageCommits),
  {
    wrapperName: '@rossmcewan/semantic-release-nx',
  },
);

export const generateNotes = wrapStep(
  'generateNotes',
  compose(
    logPluginVersion('generateNotes'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)]),
  ),
  {
    wrapperName: '@rossmcewan/semantic-release-nx',
  },
);

export const success = wrapStep(
  'success',
  compose(
    logPluginVersion('success'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)]),
  ),
  {
    wrapperName: '@rossmcewan/semantic-release-nx',
  },
);

export const fail = wrapStep(
  'fail',
  compose(
    logPluginVersion('fail'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)]),
  ),
  {
    wrapperName: '@rossmcewan/semantic-release-nx',
  },
);

export const tagFormat = readPkg.sync().name + '-v${version}';
