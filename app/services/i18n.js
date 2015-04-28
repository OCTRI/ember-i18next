import Ember from 'ember';
import { read, readHash } from 'ember-i18next/utils/stream';

/**
 * A service that exposes functionality from i18next.
 */
var I18nService = Ember.Service.extend({
  /**
   * A streamified version of the i18next `t()` function.
   *
   * @param {Object|Stream} path - an object or stream that specifies the translation
   *   lookup key. Required.
   * @param {Object|Stream} values - an object or stream that specifies values to
   *   substitute into the translation for the specified path. Optional.
   *
   * @return Localized text.
   */
  t: function(path, values) {
    var application = this.container.lookup('application:main');
    var i18n = application.get('i18n');
    var countryCode = application.localeStream.value();

    if (!countryCode) {
      countryCode = application.defaultLocale;
    }

    return i18n.t(read(path), readHash(values));
  }
});

export default I18nService;
