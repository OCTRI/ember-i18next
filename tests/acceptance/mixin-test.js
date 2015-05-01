import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import safeReset from '../helpers/safe-reset';

var application;

function lookup (name) {
  return application.__container__.lookup(name);
}

function testTranslation (assert, subject, key, options, expected) {
  var hash = options || {};
  assert.equal(subject.t(key, hash), expected);
}

function testTranslations (assert, subject) {
  testTranslation(assert, subject, 'test', {}, 'test output');
  testTranslation(assert, subject, 'test', { lng: 'th' }, 'thai test output');
}

module('Acceptance: Mixin', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    // Rebuild the registry before restarting to work around the following:
    // https://github.com/emberjs/ember.js/issues/10310
    safeReset(application);
  }
});

test('routes with mixin can translate', function(assert) {
  visit('/');

  andThen(function() {
    var indexRoute = lookup('route:index');
    assert.ok(indexRoute);
    testTranslations(assert, indexRoute);
  });
});

test('controllers with mixin can translate', function(assert) {
  visit('/');

  andThen(function () {
    var controller = lookup('controller:index');
    assert.ok(controller);
    testTranslations(assert, controller);
  });
});

test('components with mixin can translate', function(assert) {
  visit('/');

  andThen(function () {
    var component = lookup('component:t-component');
    assert.ok(component);
    testTranslations(assert, component);
  });
});
