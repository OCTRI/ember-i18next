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

  _preInitActions: {},
  _postInitActions: {},

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
    var i18next = this.get('i18next');
    var stream = this.get('localeStream');
    var self = this;

    var promises = [ this._runPreInitActions(), this._initLibrary(), this._runPostInitActions() ];

    return Ember.RSVP.all(promises).then(function () {
      self.set('isInitialized', true);
      self.set('locale', i18next.lng());
      Ember.run(function () {
        stream.notify();
      });
    }).catch(function (reason) {
      Ember.warn('A promise in the i18next init chain rejected with value: ' + reason);
    });
  },

  /**
   * Registers an action to execute before initializing i18next. Before initializing
   * the library or setting the language (which reinitializes the library), each of
   * the registered actions will be executed.
   *
   * If any pre-init actions return a promise, the service will wait until all the
   * promises have settled before initializing i18next.
   *
   * @param {String|Object} key -  the key to use to look up the action. May not be
   *   blank.
   * @param {Function} fn - a zero-argument callback function. Return a promise if
   *   the operation needs to complete before the i18next is initialized.
   */
  registerPreInitAction: function (key, fn) {
    Ember.assert('Pre-init action key may not be blank', !Ember.isBlank(key));
    Ember.assert('A pre-init action must be a function', typeof fn === 'function');
    this.get('_preInitActions')[key] = fn;
  },

  /**
   * Removes an action from the set of actions executed before initializing i18next.
   *
   * @param {String|Object} key - the key to use to look up the action to remove.
   *   May not be blank.
   */
  unregisterPreInitAction: function (key) {
    Ember.assert('Action key may not be blank', !Ember.isBlank(key));
    var preInitActions = this.get('_preInitActions');

    delete preInitActions[key];
  },

  /**
   * Registers an action to execute after initializing i18next. After initializing
   * the library or setting the language (which reinitializes the library), each of
   * the registered actions will be executed.
   *
   * If any post-init actions return a promise, the service will wait until all the
   * promises have settled before triggering a UI refresh.
   *
   * @param {String|Object} key -  the key to use to look up the action. May not be
   *   blank.
   * @param {Function} fn - a zero-argument callback function. Return a promise if
   *   the operation needs to complete before the the UI is refreshed.
   */
  registerPostInitAction: function (name, fn) {
    Ember.assert('Pre-init action name may not be blank', !Ember.isBlank(name));
    Ember.assert('A post-init action must be a function', typeof fn === 'function');
    this.get('_postInitActions')[name] = fn;
  },

  /**
   * Removes an action from the set of actions executed after initializing i18next.
   *
   * @param {String|Object} key - the key to use to look up the action to remove.
   *   May not be blank.
   */
  unregisterPostInitAction: function (key) {
    Ember.assert('Action key may not be blank', !Ember.isBlank(key));
    var postInitActions = this.get('_postInitActions');

    delete postInitActions[key];
  },


  /**
   * Notifies the locale stream when the locale is updated, triggering localized
   * text to update.
   */
  observeLocale: Ember.observer('locale', function () {
    var i18next = this.get('i18next');
    var lang = this.get('locale');
    var stream = this.get('localeStream');

    if (i18next && lang && i18next.lng() === lang) {
      return;
    }

    var promises = [ this._runPreInitActions(), this._setLng(lang), this._runPostInitActions() ];

    return Ember.RSVP.all(promises).then(function () {
      Ember.run(function () {
        stream.notify();
      });
    }).catch(function (reason) {
      Ember.warn('A promise in the locale change path rejected: ' + reason);
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
  },

  _initLibrary: function () {
    var self = this;

    var isThennable = function (obj) {
      return obj && obj.then && typeof obj.then === 'function';
    };

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var i18next = self.get('i18next');
      var options = config.i18nextOptions || {};

      var initResponse = i18next.init(options);

      if (isThennable(initResponse)) {
        initResponse.then(function () {
          resolve(i18next);
        }, function (reason) {
          reject(reason);
        });
      } else {
        Ember.warn('The response from i18next.init() was not a promise.');
        resolve(i18next);
      }
    });
  },

  _setLng: function (locale) {
    var i18next = this.get('i18next');
    return new Ember.RSVP.Promise(function (resolve) {
      i18next.setLng(locale, function () {
        resolve(locale);
      });
    });
  },

  _getActionCallHash: function (actions) {
    var actionsCallHash = {};

    Ember.keys(actions).forEach(function (key) {
      actionsCallHash[key] = actions[key].call();
    });

    return actionsCallHash;
  },

  _runPreInitActions: function () {
    var _preInitActions = this.get('_preInitActions');
    var actionCalls = this._getActionCallHash(_preInitActions);

    return Ember.RSVP.hash(actionCalls, 'ember-i18next: pre init actions');
  },

  _runPostInitActions: function () {
    var _postInitActions = this.get('_postInitActions');
    var actionCalls = this._getActionCallHash(_postInitActions);

    return Ember.RSVP.hash(actionCalls, 'ember-i18next: post init actions');
  }
});

export default I18nService;
