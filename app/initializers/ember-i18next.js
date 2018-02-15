import ENV from '../config/environment';
import Configuration from 'ember-i18next/configuration';

export function initialize(/* application */) {
  if (!ENV.i18nextOptions) {
    // eslint-disable-next-line no-console
    console.warn('No configuration found for ember-i18next. Did you set up i18nextOptions in your environment.js?');
  }

  Configuration.load(ENV.i18nextOptions);
}

export default {
  name: 'ember-i18next',
  initialize
};
