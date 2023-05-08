import EmberObject from '@ember/object';
import I18nMixin from '../../../mixins/i18n';
import { module, test } from 'qunit';

module('I18nMixin', function () {
  test('it works', function (assert) {
    const I18nObject = EmberObject.extend(I18nMixin);
    const subject = I18nObject.create();
    assert.ok(subject);
  });

  test('it adds an i18n property', function (assert) {
    const I18nObject = EmberObject.extend(I18nMixin);
    const subject = I18nObject.create();
    assert.ok('i18n' in subject);
  });

  test('it adds a t function', function (assert) {
    const I18nObject = EmberObject.extend(I18nMixin);
    const subject = I18nObject.create();
    assert.ok('t' in subject);
    assert.equal(typeof subject.t, 'function');
  });
});
