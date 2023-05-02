import { describe, expect, it } from '@jest/globals';

import versionToGitTag from './version-to-git-tag.js';

describe('#versionToGitTag', () => {
  describe('if passed a falsy version', () => {
    it('returns null rather than creating a bad git-tag', async () => {
      expect(await versionToGitTag('')).toBe(null);
      expect(await versionToGitTag(undefined)).toBe(null);
      expect(await versionToGitTag(null)).toBe(null);
    });
  });
});
