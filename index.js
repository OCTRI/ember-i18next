/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-i18next',
  included: function (app) {
    app.import('bower_components/i18next/i18next.js');
    app.import('bower_components/i18next-xhr-backend/i18nextXHRBackend.js');
  }
};
