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
  },

  /**
   * Forwarded to `i18next.preload()`.
   */
  preload: function (langs, callback) {
    return this.get('i18next').preload(langs, callback);
  },

  /**
   * Forwarded to `i18next.addResourceBundle()`.
   */
  addResourceBundle: function (lang, ns, resources, deep) {
    return this.get('i18next').addResourceBundle(lang, ns, resources, deep);
  },

  /**
   * Forwarded to `i18next.hasResourceBundle()`.
   */
  hasResourceBundle: function (lang, ns) {
    return this.get('i18next').hasResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.getResourceBundle()`.
   */
  getResourceBundle: function (lang, ns) {
    return this.get('i18next').getResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.removeResourceBundle()`.
   */
  removeResourceBundle: function (lang, ns) {
    return this.get('i18next').removeResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.addResource()`.
   */
  addResource: function (lang, ns, key, value) {
    return this.get('i18next').addResource(lang, ns, key, value);
  },

  /**
   * Forwarded to `i18next.addResources()`.
   */
  addResources: function (lang, ns, resources) {
    return this.get('i18next').addResources(lang, ns, resources);
  },

  /**
   * Forwarded to `i18next.loadNamespace()`.
   */
  loadNamespace: function (ns, callback) {
    return this.get('i18next').loadNamespace(ns, callback);
  },

  /**
   * Forwarded to `i18next.loadNamespaces()`.
   */
  loadNamespaces: function (namespaces, callback) {
    return this.get('i18next').loadNamespaces(namespaces, callback);
  },

  /**
   * Forwarded to `i18next.setDefaultNamespace()`.
   */
  setDefaultNamespace: function (ns) {
    return this.get('i18next').setDefaultNamespace(ns);
  },

  /**
   * Alias for `t()`.
   */
  translate: function (key, values) {
    return this.t(key, values);
  },

  /**
   * Forwarded to `i18next.exists()`.
   */
  exists: function (key, options) {
    return this.get('i18next').exists(key, options);
  },

  /**
   * Forwarded to `i18next.detectLanguage()`.
   */
  detectLanguage: function () {
    return this.get('i18next').detectLanguage();
  },

  /**
   * Gets i18next's `pluralExtensions` property.
   */
  pluralExtensions: Ember.computed('i18next', function () {
    return this.get('i18next').pluralExtensions;
  }),

  /**
   * Gets i18next's `sync` property.
   */
  sync: Ember.computed('i18next', function () {
    return this.get('i18next').sync;
  }),

  /**
   * Gets i18next's `functions` property.
   */
  functions: Ember.computed('i18next', function () {
    return this.get('i18next').functions;
  }),

  /**
   * Forwarded to `i18next.addPostProcessor()`.
   */
  addPostProcessor: function (name, fn) {
    return this.get('i18next').addPostProcessor(name, fn);
  },

  /**
   * Forwarded to `i18next.applyReplacement()`.
   */
  applyReplacement: function (str, replacementHash, nestedKey, options) {
    return this.get('i18next').applyReplacement(str, replacementHash, nestedKey, options);
  }
});

export default I18nService;
