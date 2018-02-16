import config from 'ember-i18next/configuration';
import { module, test } from 'qunit';

module('Unit | Utility | answer codes');

test('load() caches the configuration passed in', function(assert) {
  config.load({ foo: 'bar' });
  assert.equal(config.i18nextOptions.foo, 'bar', 'load caches configuration in the module');
});
