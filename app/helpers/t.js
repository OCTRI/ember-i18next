import Ember from 'ember';

/**
 * An HTMLBars helper function that exposes the i18next `t()` function. Automatically
 * refreshes the translated text if the application's selected locale changes.
 */
export default Ember.Helper.extend({
  i18n: Ember.inject.service(),

  /**
   * @private
   * Outputs translated text using the i18next `t()` function.
   *
   * @param {Array} params - positional parameters passed to the helper. The first
   *   element must be the translation key.
   *
   * @param {Object} hash - an object containing the hash parameters passed to the
   *   helper. Used for translation substitutions.
   *
   * @return {String} text localized for the current locale.
   */
  compute(params, hash) {
    var path = params.shift();
    return Ember.String.htmlSafe(this.get('i18n').t(path, hash));
  },

  refreshText: Ember.observer('i18n._locale', function () {
    this.recompute();
  })
});
