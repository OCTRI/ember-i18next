import Ember from 'ember';
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
  // TODO: investigate a way to avoid using this private method
  var registerHelper = Ember.HTMLBars._registerHelper;

  application.set('i18n', window.i18n);

  // Note: We have to do this ourselves for two reasons:
  // - the helper needs to manipulate the stream itself, so
  //   Ember.HTMLBars.makeBoundHelper can't be used.
  // - to avoid having to add a dash to the name
  registerHelper('t', tHelper);

  application.deferReadiness();
  application.localeStream = new Stream(function() {
    return application.get('locale');
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

  initializeLibrary(application);
}

export default {
  name: 't',
  initialize: initialize
};
