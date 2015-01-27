import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

function lookup (name) {
  return application.__container__.lookup(name);
}

function testTranslation (subject, key, options, expected) {
  var hash = options || {};
  equal(subject.t(key, hash), expected);
}

function testTranslations (subject) {
  testTranslation(subject, 'test', {}, 'test output');
  testTranslation(subject, 'test', { lng: 'th' }, 'thai test output');
}

module('Acceptance: Injections', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'reset');
  }
});

test('routes can translate', function() {
  visit('/');

  andThen(function() {
    var indexRoute = lookup('route:index');
    ok(indexRoute);
    testTranslations(indexRoute);
  });
});

test('controllers can translate', function () {
  visit('/');

  andThen(function () {
    var controller = lookup('controller:index');
    ok(controller);
    testTranslations(controller);
  });
});

test('components can translate', function () {
  visit('/');

  andThen(function () {
    var component = lookup('component:t-component');
    ok(component);
    testTranslations(component);
  });
});
