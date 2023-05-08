import { observer } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';

/**
 * An HTMLBars helper function that exposes the i18next `t()` function. Automatically
 * refreshes the translated text if the application's selected locale changes.
 */
export default Helper.extend({
  i18n: service(),

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
   * @return {*} text localized for the current locale.
   */
  compute(params, hash) {
    const path = params[0];
    const res = this.get('i18n').t(path, hash);

    return hash.returnObjects ? res : htmlSafe(res);
  },

  refreshText: observer('i18n._locale', function () {
    this.recompute();
  }),
});
