import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const mockI18next = {
  use() {
    return this;
  },
  init(options, cb) {
    if (cb) {
      cb();
    }
    return Promise.resolve();
  },
  changeLanguage(lng, cb) {
    if (cb) {
      cb();
    }
    return Promise.resolve();
  }
};

module('service:i18n', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const service = this.owner.lookup('service:i18n');
    assert.ok(service);
  });

  test('throws when action names are blank', function (assert) {
    const service = this.owner.lookup('service:i18n');

    assert.throws(function () { service.registerPreInitAction('', function () {}); },
      'Throws if registered pre-init action name is blank.');
    assert.throws(function () { service.registerPostInitAction('', function () {}); },
      'Throws if registered post-init action name is blank.');
    assert.throws(function() { service.unregisterPreInitAction(''); },
      'Throws if unregistered pre-init action name is blank.');
    assert.throws(function () { service.unregisterPostInitAction(''); },
      'Throws if unregistered post-init action name is blank.');
  });

  test('throws when actions are not functions', function (assert) {
    const service = this.owner.lookup('service:i18n');

    assert.throws(function () { service.registerPreInitAction('woo', 'woo'); },
     'Throws if pre-init action is not a function.');
    assert.throws(function () { service.registerPostInitAction('woo', 'hoo'); },
      'Throws if post-init action is not a function.');
  });

  test('initLibraryAsync triggers pre-init actions', async function (assert) {
    const service = this.owner.lookup('service:i18n');
    service.set('i18next', mockI18next);

    service.registerPreInitAction('removed-pre-init', function () {
      // should never get here
      assert.ok(false, 'Service should not call unregistered actions on init.');
    });

    service.registerPreInitAction('test-pre-init', function () {
      assert.ok(true, 'Service should call registered pre-init actions on init.');
    });

    service.unregisterPreInitAction('removed-pre-init');

    assert.expect(1);
    await service.initLibraryAsync();
  });

  test('initLibraryAsync triggers post-init actions', async function (assert) {
    const service = this.owner.lookup('service:i18n');
    service.set('i18next', mockI18next);

    service.registerPostInitAction('removed-post-init', function () {
      // should never get here
      assert.ok(false, 'Service should not call unregistered actions on init.');
    });

    service.registerPostInitAction('test-post-init', function () {
      assert.ok(true, 'Service should call registered post-init actions on init.');
    });

    service.unregisterPostInitAction('removed-post-init');

    assert.expect(1);
    await service.initLibraryAsync();
  });

  test('setting locale triggers pre-init actions', async function (assert) {
    const service = this.owner.factoryFor('service:i18n').create({
      _locale: 'en',
      isInitialized: true
    });

    service.set('i18next', mockI18next);

    service.registerPreInitAction('removed-pre-init', () => {
      // should not get here
      assert.ok(false, 'Setting locale should not trigger unregistered actions');
    });

    service.registerPreInitAction('test-pre-init', (newLang) => {
      assert.ok(true, 'Setting locale should triggered pre-init actions');
      assert.strictEqual(newLang, 'th', 'Pre-init\'s newLang is "th"');
    });

    service.unregisterPreInitAction('removed-pre-init');

    assert.expect(2);
    await service._changeLocale('th');
  });

  test('setting locale triggers post-init actions', async function (assert) {
    const service = this.owner.factoryFor('service:i18n').create({
      _locale: 'en',
      isInitialized: true
    });

    service.set('i18next', mockI18next);

    service.registerPostInitAction('removed-post-init', () => {
      // should not get here
      assert.ok(false, 'Setting locale should not trigger unregistered actions');
    });

    service.registerPostInitAction('test-post-init', (oldLang) => {
      assert.ok(true, 'Setting locale should trigger post-init actions.');
      assert.strictEqual(oldLang, 'en', 'Post-init\'s oldLang is "en"');
    });

    service.unregisterPostInitAction('removed-post-init');

    assert.expect(2);
    await service._changeLocale('th');
  });
});
