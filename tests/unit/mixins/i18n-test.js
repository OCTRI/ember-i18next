import Ember from 'ember';
import I18nMixin from '../../../mixins/i18n';
import { module, test } from 'qunit';

module('I18nMixin');

test('it works', function (assert) {
  var I18nObject = Ember.Object.extend(I18nMixin);
  var subject = I18nObject.create();
  assert.ok(subject);
});

test('it adds an i18n property', function (assert) {
  var I18nObject = Ember.Object.extend(I18nMixin);
  var subject = I18nObject.create();
  assert.ok('i18n' in subject);
});

test('it adds a t function', function (assert) {
  var I18nObject = Ember.Object.extend(I18nMixin);
  var subject = I18nObject.create();
  assert.ok('t' in subject);
  assert.equal(typeof subject.t, 'function');
});
