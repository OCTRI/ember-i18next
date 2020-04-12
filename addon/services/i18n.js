import { isBlank } from '@ember/utils';
import { assert } from '@ember/debug';
import {
  resolve,
  reject,
  hash
} from 'rsvp';
import { computed } from '@ember/object';
import Service from '@ember/service';
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';

import config from 'ember-i18next/configuration';

/**
 * A service that exposes functionality from i18next.
 */
const I18nService = Service.extend({
  i18next: null,
  isInitialized: false,

  _locale: null,
  _preInitActions: null,
  _postInitActions: null,

  _errors: null,

  init() {
    this._super(...arguments);
    this.set('i18next', i18next);
    this.set('_preInitActions', {});
    this.set('_postInitActions', {});
  },

  /**
   * The current locale. This is a settable computed property; when set, the locale
   * will be changed using `i18next.setLng()` and registered pre- and post-init
   * actions will run. Finally, the locale will change, triggering a refresh of
   * localized text.
   */
  locale: computed('i18next', '_locale', {
    get() {
      return this.get('_locale');
    },
    set(key, value) {
      const lang = value;

      if (this.get('isInitialized')) {
        this._changeLocale(lang)
          .then(lang => this.set('_locale', lang));
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
  initLibraryAsync() {
    const i18next = this.get('i18next');

    return this._runPreInitActions()
      .then(() => this._initLibrary())
      .then(() => this._runPostInitActions())
      .then(() => {
        this.set('_locale', i18next.language);
        this.set('isInitialized', true);
        return resolve();
      }).catch(reason => {
        // eslint-disable-next-line no-console
        console.warn(`A promise in the i18next init chain rejected with reason: ${reason}`);
        return reject(reason);
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
  registerPreInitAction(key, fn) {
    assert('Pre-init action key may not be blank', !isBlank(key));
    assert('A pre-init action must be a function', typeof fn === 'function');
    this.get('_preInitActions')[key] = fn;
  },

  /**
   * Removes an action from the set of actions executed before initializing i18next.
   *
   * @param {String|Object} key - the key to use to look up the action to remove.
   *   May not be blank.
   */
  unregisterPreInitAction(key) {
    assert('Action key may not be blank', !isBlank(key));
    const preInitActions = this.get('_preInitActions');

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
  registerPostInitAction(name, fn) {
    assert('Pre-init action name may not be blank', !isBlank(name));
    assert('A post-init action must be a function', typeof fn === 'function');
    this.get('_postInitActions')[name] = fn;
  },

  /**
   * Removes an action from the set of actions executed after initializing i18next.
   *
   * @param {String|Object} key - the key to use to look up the action to remove.
   *   May not be blank.
   */
  unregisterPostInitAction(key) {
    assert('Action key may not be blank', !isBlank(key));
    const postInitActions = this.get('_postInitActions');

    delete postInitActions[key];
  },


  /**
   * Changes the locale, ensuring that pre- and post-init actions run.
   *
   * @param {String} lang - locale code to set.
   *
   * @return {Promise} a promise that resolves with the language code when complete.
   */
  _changeLocale(lang) {
    const i18next = this.get('i18next');

    if (i18next && lang && i18next.language === lang) {
      return resolve(lang);
    }

    const oldLang = this._locale;
    return this._runPreInitActions(lang)
      .then(() => this._setLng(lang))
      .then(() => this._runPostInitActions(oldLang))
      .then(() => resolve(lang))
      .catch(reason => {
        // eslint-disable-next-line no-console
        console.warn(`A promise in the locale change path rejected with reason: ${reason}`);
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
  t(path, values) {
    const i18next = this.get('i18next');
    return i18next.t(path, values);
  },

  /**
   * Forwarded to `i18next.addResourceBundle()`.
   */
  addResourceBundle(lang, ns, resources, deep, overwrite) {
    return this.get('i18next').addResourceBundle(lang, ns, resources, deep, overwrite);
  },

  /**
   * Forwarded to `i18next.hasResourceBundle()`.
   */
  hasResourceBundle(lang, ns) {
    return this.get('i18next').hasResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.getResourceBundle()`.
   */
  getResourceBundle(lang, ns) {
    return this.get('i18next').getResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.removeResourceBundle()`.
   */
  removeResourceBundle(lang, ns) {
    return this.get('i18next').removeResourceBundle(lang, ns);
  },

  /**
   * Forwarded to `i18next.addResource()`.
   */
  addResource(lang, ns, key, value, options) {
    return this.get('i18next').addResource(lang, ns, key, value, options);
  },

  /**
   * Forwarded to `i18next.addResources()`.
   */
  addResources(lang, ns, resources) {
    return this.get('i18next').addResources(lang, ns, resources);
  },

  /**
   * Forwarded to `i18next.loadNamespaces()`.
   */
  loadNamespaces(namespaces, callback) {
    return this.get('i18next').loadNamespaces(namespaces, callback);
  },

  /**
   * Forwarded to `i18next.setDefaultNamespace()`.
   */
  setDefaultNamespace(ns) {
    return this.get('i18next').setDefaultNamespace(ns);
  },

  /**
   * Alias for `t()`.
   */
  translate(key, values) {
    return this.t(key, values);
  },

  /**
   * Forwarded to `i18next.exists()`.
   */
  exists(key, options) {
    return this.get('i18next').exists(key, options);
  },

  /**
   * Gets i18next's `pluralExtensions` property.
   */
  pluralExtensions: computed('i18next', function () {
    return this.get('i18next').pluralExtensions;
  }),

  /**
   * Forwarded to `i18next.addPostProcessor()`.
   */
  addPostProcessor(name, fn) {
    return this.get('i18next').addPostProcessor(name, fn);
  },

  /**
   * Forwarded to `i18next.applyReplacement()`.
   */
  applyReplacement(str, replacementHash, nestedKey, options) {
    return this.get('i18next').applyReplacement(str, replacementHash, nestedKey, options);
  },

  _initLibrary() {
    const i18next = this.get('i18next');
    const options = config.i18nextOptions || {};

    let errors;

    //
    //  TODO:  Adding i18nextXHRBackend by default so that translation
    //         files can be loaded.
    //         How do we extend this so that other plugins can be added
    //         dynamically?
    //
    return i18next
      .use(i18nextXHRBackend)
      .init(options, (err) => {
        if (err) errors = err;
      })
      .then(() => {
        if (errors) {
          return reject(errors);
        }
        else {
          return resolve(i18next);
        }
      });
  },

  _setLng(locale) {
    const i18next = this.get('i18next');
    return i18next.changeLanguage(locale)
      .then(() => resolve(locale));
  },

  _getActionCallHash(actions, lang) {
    const actionsCallHash = {};

    Object.keys(actions).forEach(key => {
      actionsCallHash[key] = actions[key].call(undefined, lang);
    });

    return actionsCallHash;
  },

  _runPreInitActions(newLang) {
    const _preInitActions = this.get('_preInitActions');
    const actionCalls = this._getActionCallHash(_preInitActions, newLang);

    return hash(actionCalls, 'ember-i18next: pre init actions');
  },

  _runPostInitActions(oldLang) {
    const _postInitActions = this.get('_postInitActions');
    const actionCalls = this._getActionCallHash(_postInitActions, oldLang);

    return hash(actionCalls, 'ember-i18next: post init actions');
  }
});

export default I18nService;
