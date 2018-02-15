/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    },
    {
      name: 'ember-1.13',
      dependencies: {
        'ember': '1.13.11'
      }
    },
    {
      name: 'ember-2.0',
      dependencies: {
        'ember': '2.0.2'
      }
    },
    {
      name: 'ember-2.4',
      dependencies: {
        'ember': '~2.4.0'
      }
    },
    {
      name: 'ember-2.8',
      dependencies: {
        'ember': '~2.8.0'
      }
    },
    {
      name: 'ember-2.12',
      dependencies: {
        'ember': '~2.12.0'
      }
    }
  ]
};
