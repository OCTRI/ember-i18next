import Ember from 'ember';

/**
 * Rebuilds the application registry before resetting the application. Works
 * around the following GitHub issue, which was causing "Cannot re-register:
 * `utils:t`, as it has already been resolved." messages in the translation
 * tests:
 *
 * https://github.com/emberjs/ember.js/issues/10310
 */
export default function safeReset (app) {
  Ember.run(function () {
    if (typeof app.buildRegistry === 'function') {
      app.registry = app.buildRegistry();
    }
    app.reset();
  });
}
