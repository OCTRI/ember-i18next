import Ember from 'ember';
import T from 'ember-i18next/utils/t';
import Stream from 'ember-i18next/utils/stream';
import tHelper from '../helpers/t';
import config from '../config/environment';

function initializeLibrary (application) {
  var locale = localStorage.locale || config.defaultLocale || 'en';
  var baseURL = config.baseURL || '/';

  var defaultOptions = {
    ns: {
      namespaces: [ 'main' ],
      defaultNs: 'main'
    },
    cookieName: 'locale',
    preload: [ locale ],
    lng: locale,
    fallbackLng: 'en',
    getAsync: true,
    resGetPath: baseURL + 'locales/__ns__/__lng__.json'
  };

  var options = config.i18nOptions || defaultOptions;

  window.i18n.init(options, function () {
    Ember.run(function () {
      application.advanceReadiness();
      application.set('locale', 'en');
    });
  });
}

export function initialize(container, application) {
  application.set('i18n', window.i18n);

  Ember.HTMLBars.registerHelper('t', tHelper);

  application.deferReadiness();
  application.localeStream = new Stream(function() {
    return  application.get('locale');
  });

  Ember.addObserver(application, 'locale', function() {
    var i18n = application.get('i18n');
    var lang = application.get('locale');
    i18n.setLng(lang, function () {
      Ember.run(function () {
        application.localeStream.notify();
      });
    });
  });

  application.register('utils:t', T);
  application.inject('route', 't', 'utils:t');
  application.inject('component', 't', 'utils:t');
  application.inject('controller', 't', 'utils:t');

  initializeLibrary(application);
}

export default {
  name: 't',
  initialize: initialize
};
