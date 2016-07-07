import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:i18n', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it exists', function(assert) {
  const service = this.subject();
  assert.ok(service);
});

test('throws when action names are blank', function (assert) {
  const service = this.subject();

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
  const service = this.subject();

  assert.throws(function () { service.registerPreInitAction('woo', 'woo'); },
   'Throws if pre-init action is not a function.');
  assert.throws(function () { service.registerPostInitAction('woo', 'hoo'); },
    'Throws if post-init action is not a function.');
});
