import Ember from 'ember';
import config from '../config/environment';

/**
 * A service that exposes functionality from i18next.
 */
var I18nService = Ember.Service.extend({
  i18next: null,
  isInitialized: false,

  _locale: null,
  _preInitActions: {},
  _postInitActions: {},

  init: function () {
    Ember.assert(window.i18next, 'i18next was not found. Check your bower.json file to make sure it is loaded.');
    Ember.assert(window.i18nextXHRBackend, 'i18nextXHRBackend was not found. Check your bower.json file to make sure it is loaded.');
    this.set('i18next', window.i18next);
  },

  /**
   * The current locale. This is a settable computed property; when set, the locale
   * will be changed using `i18next.setLng()` and registered pre- and post-init
   * actions will run. Finally, the locale will change, triggering a refresh of
   * localized text.
   */
  locale: Ember.computed('i18next', '_locale', {
    get() {
      return this.get('_locale');
    },
    set(key, value) {
      var lang = value;
      var self = this;

      if (this.get('isInitialized')) {
        this._changeLocale(lang).then(function (lang) {
          self.set('_locale', lang);
        });
      } else {
        this.set('_locale', lang);
      }

      return lang;
    }
  }),

  /**
   * Initializes the i18next library with configuration from the environment.
   *
   * @return {Promise} - a promise that resolves with the i18next object when
   *   i18next has finished initializing.
   */
  initLibraryAsync: function () {
    var i18next = this.get('i18next');
    var self = this;

    return this._runPreInitActions().then(function () {
      return self._initLibrary();
    }).then(function () {
      self._runPostInitActions();
    }).then(function () {
      self.set('locale', i18next.language);
      self.set('isInitialized', true);
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
   * Changes the locale, ensuring that pre- and post-init actions run.
   *
   * @param {String} lang - locale code to set.
   *
   * @return {Promise} a promise that resolves with the language code when complete.
   */
  _changeLocale: function (lang) {
    var i18next = this.get('i18next');

    if (i18next && lang && i18next.language === lang) {
      return Ember.RSVP.resolve(lang);
    }

    var self = this;
    var oldLang = this._locale;
    return this._runPreInitActions(lang).then(function () {
      return self._setLng(lang);
    }).then(function () {
      return self._runPostInitActions(oldLang);
    }).then(function () {
      return Ember.RSVP.resolve(lang);
    }).catch(function (reason) {
      Ember.warn('A promise in the locale change path rejected: ' + reason);
    });
  },

  /**
   * Forwarded to `i18next.t()`.
   *
   * @param {String} path - an string that specifies the translation lookup key.
   *   Required.
   * @param {Object} values - an object that specifies values to substitute into
   *   the translation for the specified path. Optional.
   *
   * @return Localized text.
   */
  t: function(path, values) {
    var i18next = this.get('i18next');
    return i18next.t(path, values);
  },

  /**
   * Forwarded to `i18next.addResourceBundle()`.
   */
  addResourceBundle: function (lang, ns, resources, deep, overwrite) {
    return this.get('i18next').addResourceBundle(lang, ns, resources, deep, overwrite);
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
  addResource: function (lang, ns, key, value, options) {
    return this.get('i18next').addResource(lang, ns, key, value, options);
  },

  /**
   * Forwarded to `i18next.addResources()`.
   */
  addResources: function (lang, ns, resources) {
    return this.get('i18next').addResources(lang, ns, resources);
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
   * Gets i18next's `pluralExtensions` property.
   */
  pluralExtensions: Ember.computed('i18next', function () {
    return this.get('i18next').pluralExtensions;
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

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var i18next = self.get('i18next');
      var options = config.i18nextOptions || {};

      //
      //  TODO:  Adding i18nextXHRBackend by default so that translation
      //         files can be loaded.
      //         How do we extend this so that other plugins can be added
      //         dynamically?
      //
      i18next
        .use(window.i18nextXHRBackend)
        .init(options, (err, t) => {
         if ( err ) {
           reject( err );
         } else {
           resolve( i18next );
         }
      });
    });
  },

  _setLng: function (locale) {
    var i18next = this.get('i18next');

    return new Ember.RSVP.Promise(function (resolve) {
      i18next.changeLanguage(locale, function () {
        resolve(locale);
      });
    });
  },

  _getActionCallHash: function (actions, lang) {
    var actionsCallHash = {};

    Object.keys(actions).forEach(function (key) {
      actionsCallHash[key] = actions[key].call(undefined, lang);
    });

    return actionsCallHash;
  },

  _runPreInitActions: function (newLang) {
    var _preInitActions = this.get('_preInitActions');
    var actionCalls = this._getActionCallHash(_preInitActions, newLang);

    return Ember.RSVP.hash(actionCalls, 'ember-i18next: pre init actions');
  },

  _runPostInitActions: function (oldLang) {
    var _postInitActions = this.get('_postInitActions');
    var actionCalls = this._getActionCallHash(_postInitActions, oldLang);

    return Ember.RSVP.hash(actionCalls, 'ember-i18next: post init actions');
  }
});

export default I18nService;
