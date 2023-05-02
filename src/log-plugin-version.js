import { resolve } from 'path';
import readPkg from 'read-pkg';
import debugFactory from 'debug';

const debug = debugFactory('semantic-release:nx');

export const logPluginVersion = type => plugin => async (pluginConfig, config) => {
  if (config.options.debug) {
    const { version } = await readPkg(resolve(__dirname, '../'));
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};
