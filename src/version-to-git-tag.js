import { readPackage } from 'read-pkg';

export default async (version) => {
  if (!version) {
    return null;
  }

  const { name } = await readPackage();
  return `${name}-v${version}`;
};
