import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

let service;

module('Acceptance: ServiceLocaleChangeActions', function (hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(function () {
    service = this.owner.lookup('service:i18n');
  });

  test('setting language triggers pre-init actions', async function (assert) {
    assert.expect(2);

    await visit('/');
    await click('a#change-language-en');

    service.registerPreInitAction('test-pre-init', (newLang) => {
      assert.ok(true, 'Setting locale triggers pre-init action');
      assert.strictEqual(newLang, 'th', 'Pre-init\'s newLang is "th"');
    });

    await click('a#change-language-th');
  });

  test('setting language triggers post-init actions', async function (assert) {
    assert.expect(2);

    await visit('/');
    await click('a#change-language-en');

    service.registerPostInitAction('test-post-init', (oldLang) => {
      assert.ok(true, 'Setting locale triggers post-init action');
      assert.strictEqual(oldLang, 'en', 'Post-init\'s oldLang is "en"');
    });

    await click('a#change-language-th');
  });

  test('unregistering pre-init actions', async function (assert) {
    assert.expect(1);

    await visit('/');
    await click('a#change-language-en');

    service.registerPreInitAction('removed-pre-init', () => {
      // should not get here
      assert.ok(
        false,
        'Setting locale should not trigger unregistered actions'
      );
    });

    service.registerPreInitAction('test-pre-init', () => {
      assert.ok(true, 'Setting locale should triggered pre-init actions');
    });

    service.unregisterPreInitAction('removed-pre-init');

    await click('a#change-language-th');
  });

  test('unregistering post-init actions', async function (assert) {
    assert.expect(1);

    await visit('/');
    await click('a#change-language-en');

    service.registerPostInitAction('removed-post-init', () => {
      // should not get here
      assert.ok(
        false,
        'Setting locale should not trigger unregistered actions'
      );
    });

    service.registerPostInitAction('test-post-init', () => {
      assert.ok(true, 'Setting locale should trigger post-init actions.');
    });

    service.unregisterPostInitAction('removed-post-init');

    await click('a#change-language-th');
  });
});
