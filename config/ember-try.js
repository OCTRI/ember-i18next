'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            'ember-auto-import': '^2.6.3',
            webpack: '^5.78.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            'ember-auto-import': '^2.6.3',
            webpack: '^5.78.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
            'ember-auto-import': '^2.6.3',
            webpack: '^5.78.0',
          },
        },
      },
      // {
      //   name: 'ember-beta',
      //   npm: {
      //     devDependencies: {
      //       'ember-source': await getChannelURL('beta'),
      //       'ember-auto-import': '^2.6.3',
      //       'webpack': '^5.78.0'
      //     },
      //   },
      // },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
