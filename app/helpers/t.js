import Stream from 'ember-i18next/utils/stream';
import { subscribe } from 'ember-i18next/utils/stream';

/**
 * An HTMLBars helper function that exposes the i18next `t()` function. Automatically
 * refreshes the translated text if the application's selected locale changes.
 *
 * Note: This helper must not be passed through Ember.HTMLBars.makeBoundHelper, since
 * it is already wrapped in a stream (essentially, it already is an HTMLBars bound
 * helper). If you find that `{{t}}` always displays the text `[object Object]`, make sure
 * that you don't have something like `Ember.HTMLBars.makeBoundHelper('t', tHelper)`
 * in your code. For this reason, the helper should be registered manually with
 * `Ember.HTMLBars._registerHelper`.
 *
 * @param {Object[]} params - An array of resolved order parameters. The first
 *   element should be the translation key to pass to `t()`.
 * @param {Object} hash - An object containing the hash parameters, used for translation
 *   substitutions.
 * @param {Object} options - Not used.
 * @param {Object} env - The HTMLBars environment in which the helper is running.
 *
 * @return {Stream} a stream that updates its value if the contents of `params`,
 *   the values in `hash`, or the application locale change.
 */
export default function tHelper(params, hash, options, env) {
  var view = env.data.view;
  var path = params.shift();

  var container = view.container;
  var i18n = container.lookup('service:i18n');
  var application = container.lookup('application:main');

  var stream = new Stream(function() {
    return i18n.t(path, hash);
  });

  var i, l, param, prop;

  // bind any arguments that are Streams
  for (i = 0, l = params.length; i < l; i++) {
    param = params[i];
    subscribe(param, stream.notify, stream);
  }

  for (prop in hash) {
    param = hash[prop];
    subscribe(param, stream.notify, stream);
  }

  subscribe(path, stream.notify, stream);
  subscribe(application.localeStream, stream.notify, stream);

  return stream;
}
