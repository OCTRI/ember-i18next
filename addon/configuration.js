/**
 * ember-i18next configuration object. Used to get i18next configuration from the
 * consuming app's environment into the addon.
 *
 * @see `app/initializers/ember-i18next.js`
 */
export default {
  i18nextOptions: null,

  load(config) {
    this.i18nextOptions = config;
  },
};
