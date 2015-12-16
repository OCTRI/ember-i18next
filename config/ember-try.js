/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
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
      name: 'ember-2.1',
      dependencies: {
        'ember': '2.1.1'
      }
    }
  ]
};
