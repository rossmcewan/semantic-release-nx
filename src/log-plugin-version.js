import { resolve } from 'node:path';
import { readPackage } from 'read-pkg';
import debugFactory from 'debug';

const debug = debugFactory('semantic-release:nx');

export const logPluginVersion =
  (type) => (plugin) => async (pluginConfig, config) => {
    if (config.options.debug) {
      const { version } = await readPackage(resolve(__dirname, '../'));
      debug('Running %o version %o', type, version);
    }

    return plugin(pluginConfig, config);
  };
