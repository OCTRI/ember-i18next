import Ember from 'ember';
import T from 'ember-i18next/utils/t';
import Stream from 'ember-i18next/utils/stream';
import tHelper from '../helpers/t';
import config from '../config/environment';

function initializeLibrary (application) {
  var options = config.i18nextOptions || {};

  window.i18n.init(options, function () {
    Ember.run(function () {
      application.advanceReadiness();
      application.set('locale', window.i18n.lng());
    });
  });
}

export function initialize(container, application) {
  var registerHelper = Ember.HTMLBars.registerHelper;
  var makeBoundHelper = Ember.HTMLBars.makeBoundHelper;

  application.set('i18n', window.i18n);

  registerHelper('t', makeBoundHelper(tHelper));

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
