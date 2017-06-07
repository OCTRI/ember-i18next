import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

let application, container, service;

module('Acceptance: ServiceInitActions', {
  beforeEach: function() {
    application = startApp();
    container = application.__container__;
    service = container.lookup('service:i18n');
  },

  afterEach: function() {
    destroyApp(application);
  }
});

test('pre-init actions', function (assert) {
  assert.expect(2);

  service.registerPreInitAction('test-pre-init', function (newLang) {
    assert.ok(true, 'Service calls pre-init actions on initLibraryAsync');
    assert.strictEqual(typeof newLang, 'undefined', 'Pre-init\'s newLang param is undefined on initLibraryAsync');
  });

  visit('/test-init');
});

test('post-init actions', function (assert) {
  assert.expect(2);

  service.registerPostInitAction('test-post-init', function (oldLang) {
    assert.ok(true, 'Service calls post-init actions on initLibraryAsync');
    assert.strictEqual(typeof oldLang, 'undefined', 'Post-init\'s oldLang param is undefined on initLibraryAsync');
  });

  visit('/test-init');
});

test('unregistering pre-init actions', function (assert) {
  assert.expect(1);

  service.registerPreInitAction('removed-pre-init', function () {
    // should never get here
    assert.ok(false, 'Service should not call unregistered actions on init.');
  });

  service.registerPreInitAction('test-pre-init', function () {
    assert.ok(true, 'Service should call registered pre-init actions on init.');
  });

  service.unregisterPreInitAction('removed-pre-init');

  visit('/test-init');
});

test('unregistering post-init actions', function (assert) {
  assert.expect(1);

  service.registerPostInitAction('removed-post-init', function () {
    // should never get here
    assert.ok(false, 'Service should not call unregistered actions on init.');
  });

  service.registerPostInitAction('test-post-init', function () {
    assert.ok(true, 'Service should call registered post-init actions on init.');
  });

  service.unregisterPostInitAction('removed-post-init');

  visit('/test-init');
});
