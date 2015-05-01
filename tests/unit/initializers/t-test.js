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

test('helper is registered', function(assert) {
  assert.expect(1);
  var helper = container.lookup('helper:t');
  assert.ok(helper);
});
