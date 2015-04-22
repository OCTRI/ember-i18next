import Ember from 'ember';
import {module, test} from 'qunit';
import { initialize } from 'dummy/initializers/t';

var container, application, testKey, testTranslation;

module('TInitializer', {
  beforeEach: function() {
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

test('stream is created', function(assert) {
  assert.expect(2);
  assert.ok(application.localeStream);
  assert.ok(application.localeStream.isStream);
});

test('i18n is attached to application', function(assert) {
  assert.expect(1);
  assert.ok(application.i18n);
});

test('t is injected into routes', function(assert) {
  assert.expect(2);

  var TestRoute = Ember.Route.extend({});
  container.register('route:test', TestRoute);

  var testRouteInstance = container.lookup('route:test');

  assert.ok(testRouteInstance.t);
  assert.ok(typeof testRouteInstance.t === 'function');
});

test('t is injected into controllers', function(assert) {
  assert.expect(2);

  var TestController = Ember.Controller.extend({});
  container.register('controller:test', TestController);

  var testControllerInstance = container.lookup('controller:test');

  assert.ok(testControllerInstance.t);
  assert.ok(typeof testControllerInstance.t === 'function');
});

test('t is injected into components', function(assert) {
  assert.expect(2);

  var TestComponent = Ember.Component.extend({});
  container.register('component:test', TestComponent);

  var testComponentInstance = container.lookup('component:test');

  assert.ok(testComponentInstance.t);
  assert.ok(typeof testComponentInstance.t === 'function');
});
