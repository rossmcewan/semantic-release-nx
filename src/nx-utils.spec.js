import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const graphFixture = {
  graph: {
    nodes: {
      'project-a': {
        name: 'project-a',
        type: 'lib',
        data: {
          root: 'packages/project-a',
        },
      },
      'project-b': {
        name: 'project-b',
        type: 'lib',
        data: {
          root: 'packages/project-b',
        },
      },
      'project-c': {
        name: 'project-c',
        type: 'lib',
        data: {
          root: 'packages/project-c',
        },
      },
      'project-d': {
        name: 'project-d',
        type: 'lib',
        data: {
          root: 'packages/project-d',
        },
      },
    },
    dependencies: {
      'project-a': [
        {
          source: 'project-a',
          target: 'project-d',
          type: 'static',
        },
      ],
      'project-b': [
        {
          source: 'project-b',
          target: 'project-d',
          type: 'static',
        },
        {
          source: 'project-b',
          target: 'project-a',
          type: 'static',
        },
      ],
      'project-c': [
        {
          source: 'project-c',
          target: 'project-d',
          type: 'static',
        },
      ],
      'project-d': [],
    },
  },
  affectedProjects: [],
  criticalPath: [],
};

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify(graphFixture)),
}));

jest.unstable_mockModule('node:child_process', () => ({
  execSync: jest.fn(),
}));

const isAffectedByPath = (await import('./nx-utils.js')).isAffectedByPath;

describe('nx utils', () => {
  beforeEach(() => {});

  it('should return true if project is affected by files', () => {
    const projectPath = 'packages/project-a';
    const filesPath = 'packages/project-d/src/thefile.js';

    const isAffected = isAffectedByPath(projectPath, filesPath);
    expect(isAffected).toBe(true);
  });
  it('should return false if paths not affected by project path', () => {
    const projectPath = 'packages/project-a';
    const filesPath = 'packages/project-b/src/thefile.js';

    const isAffected = isAffectedByPath(projectPath, filesPath);
    expect(isAffected).toBe(false);
  });
});
