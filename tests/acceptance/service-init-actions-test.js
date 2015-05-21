import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application, container, service;

module('Acceptance: ServiceInitActions', {
  beforeEach: function() {
    application = startApp();
    container = application.__container__;
    service = container.lookup('service:i18n');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('pre-init actions', function (assert) {
  assert.expect(1);

  service.registerPreInitAction('test-pre-init', function () {
    assert.ok(true, 'Service calls pre-init actions on initLibraryAsync');
  });

  visit('/test-init');
});

test('post-init actions', function (assert) {
  assert.expect(1);

  service.registerPostInitAction('test-pre-init', function () {
    assert.ok(true, 'Service calls post-init actions on initLibraryAsync');
  });

  visit('/test-init');
});
