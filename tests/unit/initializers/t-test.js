import Ember from 'ember';
import {module, test} from 'qunit';
import { initialize } from 'dummy/initializers/t';

var container, application, testKey, testTranslation;

module('initializer:t', {
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
