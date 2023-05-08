import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

function testTranslation(assert, subject, key, options, expected) {
  const hash = options || {};
  assert.equal(subject.t(key, hash), expected);
}

function testTranslations(assert, subject) {
  testTranslation(assert, subject, 'test', { lng: 'en' }, 'test output');
  testTranslation(assert, subject, 'test', { lng: 'th' }, 'thai test output');
}

module('Acceptance: Mixin', function (hooks) {
  setupApplicationTest(hooks);

  test('routes with mixin can translate', async function (assert) {
    await visit('/');

    const indexRoute = this.owner.lookup('route:index');
    assert.expect(3);
    assert.ok(indexRoute);
    testTranslations(assert, indexRoute);
  });

  test('controllers with mixin can translate', async function (assert) {
    await visit('/');

    const controller = this.owner.lookup('controller:index');
    assert.expect(3);
    assert.ok(controller);
    testTranslations(assert, controller);
  });

  test('components with mixin can translate', async function (assert) {
    await visit('/');

    const component = this.owner.lookup('component:t-component');
    assert.expect(3);
    assert.ok(component);
    testTranslations(assert, component);
  });
});
