import Ember from 'ember';
import config from '../config/environment';
import Stream from 'ember-i18next/utils/stream';
import { read, readHash } from 'ember-i18next/utils/stream';

/**
 * A service that exposes functionality from i18next.
 */
var I18nService = Ember.Service.extend({
  i18next: null,
  locale: null,
  localeStream: null,
  isInitialized: false,

  init: function () {
    Ember.assert(window.i18n, 'i18next was not found. Check your bower.json file to make sure it is loaded.');
    this.set('i18next', window.i18n);

    this.set('localeStream', new Stream(function () {
      return this.get('locale');
    }));
  },

  /**
   * Initializes the i18next library with configuration from the environment.
   *
   * @return {Promise} - a promise that resolves with the i18next object when
   *   i18next has finished initializing.
   */
  initLibraryAsync: function () {
    // var application = this.container.lookup('application:main');
    var options = config.i18nextOptions || {};
    var i18next = this.get('i18next');
    var self = this;

    var isThennable = function (obj) {
      return obj && obj.then && typeof obj.then === 'function';
    };

    if (!this.get('isInitialized')) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        var initResponse = i18next.init(options);

        if (isThennable(initResponse)) {
          initResponse.then(function () {
            self.set('isInitialized', true);
            self.set('locale', i18next.lng());
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
   * Notifies the locale stream when the locale is updated, triggering localized
   * text to update.
   */
  observeLocale: Ember.observer('locale', function () {
    var lang = this.get('locale');
    var stream = this.get('localeStream');
    var i18next = this.get('i18next');

    i18next.setLng(lang, function () {
      Ember.run(function () {
        stream.notify();
      });
    });
  }),

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
    var i18next = this.get('i18next');
    var localeStream = this.get('localeStream');

    localeStream.value(); // pull on the locale stream to trigger update
    return i18next.t(read(path), readHash(values));
  }
});

export default I18nService;
