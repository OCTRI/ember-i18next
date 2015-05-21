import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application, container, service;

module('Acceptance: ServiceLocaleChangeActions', {
  beforeEach: function() {
    application = startApp();
    container = application.__container__;
    service = container.lookup('service:i18n');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('setting language triggers pre-init actions', function (assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    service.registerPreInitAction('test-pre-init', function () {
      assert.ok(true, 'Setting locale triggers pre-init action');
    });
  });

  click('a#change-language-link');
});

test('setting language triggers post-init actions', function (assert) {
  assert.expect(1);

  visit('/');

  andThen(function () {
    service.registerPostInitAction('test-post-init', function () {
      assert.ok(true, 'Setting locale triggers post-init action');
    });
  });

  click('a#change-language-link');
});
