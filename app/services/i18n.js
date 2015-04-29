import Ember from 'ember';
import config from '../config/environment';
import { read, readHash } from 'ember-i18next/utils/stream';

/**
 * A service that exposes functionality from i18next.
 */
var I18nService = Ember.Service.extend({
  isInitialized: false,

  /**
   * Initializes the i18next library with configuration from the environment.
   *
   * @return {Promise} - a promise that resolves with the i18next object when
   *   i18next has finished initializing.
   */
  initLibraryAsync: function () {
    var application = this.container.lookup('application:main');
    var options = config.i18nextOptions || {};
    var i18next = window.i18n;
    var self = this;

    Ember.assert('i18next was not found. Check your bower.json file.', i18next);

    var isThennable = function (obj) {
      return obj && obj.then && typeof obj.then === 'function';
    };

    if (!this.get('isInitialized')) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        var initResponse = i18next.init(options);

        if (isThennable(initResponse)) {
          initResponse.then(function () {
            self.set('isInitialized', true);
            application.set('locale', i18next.lng());
            resolve(i18next);
          }, function (val) {
            Ember.warn('i18next.init() rejected with value: ' + val);
            reject(val);
          });
        } else {
          Ember.warn('The response from i18next.init() was not a promise.');
          resolve(i18next);
        }
      });
    }

  },

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
