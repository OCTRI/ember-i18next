import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance: ServiceInitActions', function(hooks) {
  setupApplicationTest(hooks);

  test('pre-init actions', async function(assert) {
    assert.expect(2);

    const service = this.owner.lookup('service:i18n');
    service.registerPreInitAction('test-pre-init', function (newLang) {
      assert.ok(true, 'Service calls pre-init actions on initLibraryAsync');
      assert.strictEqual(typeof newLang, 'undefined', 'Pre-init\'s newLang param is undefined on initLibraryAsync');
    });

    await visit('/test-init');
  });

  test('post-init actions', async function(assert) {
    assert.expect(2);

    const service = this.owner.lookup('service:i18n');
    service.registerPostInitAction('test-post-init', function (oldLang) {
      assert.ok(true, 'Service calls post-init actions on initLibraryAsync');
      assert.strictEqual(typeof oldLang, 'undefined', 'Post-init\'s oldLang param is undefined on initLibraryAsync');
    });

    await visit('/test-init');
  });

  test('unregistering pre-init actions', async function(assert) {
    assert.expect(1);

    const service = this.owner.lookup('service:i18n');
    service.registerPreInitAction('removed-pre-init', function () {
      // should never get here
      assert.ok(false, 'Service should not call unregistered actions on init.');
    });

    service.registerPreInitAction('test-pre-init', function () {
      assert.ok(true, 'Service should call registered pre-init actions on init.');
    });

    service.unregisterPreInitAction('removed-pre-init');

    await visit('/test-init');
  });

  test('unregistering post-init actions', async function(assert) {
    assert.expect(1);

    const service = this.owner.lookup('service:i18n');
    service.registerPostInitAction('removed-post-init', function () {
      // should never get here
      assert.ok(false, 'Service should not call unregistered actions on init.');
    });

    service.registerPostInitAction('test-post-init', function () {
      assert.ok(true, 'Service should call registered post-init actions on init.');
    });

    service.unregisterPostInitAction('removed-post-init');

    await visit('/test-init');
  });
});
