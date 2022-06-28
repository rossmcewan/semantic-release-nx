const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const path = require("path");

const depGraphCache = {};

const getProjectFromPath = (projectPath) => {
  const parts = path.normalize(projectPath).split(path.sep);
  return parts[parts.length - 1];
};

const getDependencyPaths = (project) => {
  if (depGraphCache[project]) return depGraphCache[project];
  const depsFile = `tmp/${project}-deps.json`;
  execSync(`npx nx dep-graph --focus ${project} --file ${depsFile}`);
  const contents = readFileSync(`../../${depsFile}`, "utf-8");
  const { graph } = JSON.parse(contents);
  const result = new Set();
  const dependencies = graph.dependencies[project];
  dependencies
    .forEach((dependency) => {
      const dependencyNode = graph.nodes[dependency.target];
      result.add(dependencyNode.data.root);
    });

  const array = Array.from(result);
  depGraphCache[project] = array;
  return array;
};

const isAffectedByPath = (projectPath, filePath) => {
  const project = getProjectFromPath(projectPath);
  const dependencyPaths = getDependencyPaths(project);

  const fileSegments = path.normalize(filePath).split(path.sep);
  const affectedPath = dependencyPaths.find((dependencyPath) => {
    const pathSegments = dependencyPath.split(path.sep);
    return pathSegments.every(
      (segment, index) => segment === fileSegments[index]
    );
  });
  return !!affectedPath;
};

module.exports = {
  isAffectedByPath,
};
