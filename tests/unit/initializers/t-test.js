import Ember from 'ember';
import { initialize } from 'dummy/initializers/t';

var container, application, testKey, testTranslation;

module('TInitializer', {
  setup: function() {
    testKey = 'test';
    testTranslation = 'test output';

    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
      initialize(container, application);
    });
  }
});

test('stream is created', function() {
  expect(2);
  ok(application.localeStream);
  ok(application.localeStream.isStream);
});

test('i18n is attached to application', function () {
  expect(1);
  ok(application.i18n);
});

test('t is injected into routes', function () {
  expect(2);

  var TestRoute = Ember.Route.extend({});
  container.register('route:test', TestRoute);

  var testRouteInstance = container.lookup('route:test');

  ok(testRouteInstance.t);
  ok(typeof testRouteInstance.t === 'function');
});

test('t is injected into controllers', function () {
  expect(2);

  var TestController = Ember.Controller.extend({});
  container.register('controller:test', TestController);

  var testControllerInstance = container.lookup('controller:test');

  ok(testControllerInstance.t);
  ok(typeof testControllerInstance.t === 'function');
});

test('t is injected into components', function () {
  expect(2);

  var TestComponent = Ember.Component.extend({});
  container.register('component:test', TestComponent);

  var testComponentInstance = container.lookup('component:test');

  ok(testComponentInstance.t);
  ok(typeof testComponentInstance.t === 'function');
});
