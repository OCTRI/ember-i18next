import Ember from 'ember';

/**
 * Mixes internationalization (i18n) functionality from the i18next library into
 * the extending class. This mixin will add the following properties:
 *
 * @property {I18nService} i18n - the application's i18n service
 * @property {Function} t - a shortcut to the i18n service's `t()` method, for
 *   convenience.
 * @see services/i18n
 */
const I18nMixin = Ember.Mixin.create({
  i18n: Ember.inject.service(),

  t(path, values) {
    return this.get('i18n').t(path, values);
  }
});

export default I18nMixin;
