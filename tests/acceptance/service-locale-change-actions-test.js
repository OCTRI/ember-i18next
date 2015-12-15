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
  assert.expect(2);

  visit('/');
  click('a#change-language-en');

  andThen(function() {
    service.registerPreInitAction('test-pre-init', function (newLang) {
      assert.ok(true, 'Setting locale triggers pre-init action');
      assert.strictEqual(newLang, 'th', 'Pre-init\'s newLang is "th"');
    });
  });

  click('a#change-language-th');
});

test('setting language triggers post-init actions', function (assert) {
  assert.expect(2);

  visit('/');
  click('a#change-language-en');

  andThen(function () {
    service.registerPostInitAction('test-post-init', function (oldLang) {
      assert.ok(true, 'Setting locale triggers post-init action');
      assert.strictEqual(oldLang, 'en', 'Post-init\'s oldLang is "en"');
    });
  });

  click('a#change-language-th');
});

test('unregistering pre-init actions', function (assert) {
  assert.expect(1);

  visit('/');
  click('a#change-language-en');

  andThen(function() {
    service.registerPreInitAction('removed-pre-init', function () {
      // should not get here
      assert.ok(false, 'Setting locale should not trigger unregistered actions');
    });

    service.registerPreInitAction('test-pre-init', function () {
      assert.ok(true, 'Setting locale should triggered pre-init actions');
    });

    service.unregisterPreInitAction('removed-pre-init');
  });

  click('a#change-language-th');
});

test('unregistering post-init actions', function (assert) {
  assert.expect(1);

  visit('/');
  click('a#change-language-en');

  andThen(function () {
    service.registerPostInitAction('removed-post-init', function () {
      // should not get here
      assert.ok(false, 'Setting locale should not trigger unregistered actions');
    });

    service.registerPostInitAction('test-post-init', function () {
      assert.ok(true, 'Setting locale should trigger post-init actions.');
    });

    service.unregisterPostInitAction('removed-post-init');
  });

  click('a#change-language-th');
});
