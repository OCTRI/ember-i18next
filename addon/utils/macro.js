import { assert } from '@ember/debug';
import { computed, get } from '@ember/object';

export default function createTranslatedComputedProperty(key, interpolations = {}) {
  const values = Object.keys(interpolations).map(key => interpolations[key]);
  const dependencies = [ 'i18n.locale' ].concat(values);

  return computed(...dependencies, function() {
    const i18n = get(this, 'i18n');
    assert(`Cannot translate ${key}. ${this} does not have an i18n.`, i18n);
    return i18n.t(key, mapPropertiesByHash(this, interpolations));
  });
}

function mapPropertiesByHash(object, hash) {
  const result = {};

  Object.keys(hash).forEach(function(key) {
    result[key] = get(object, hash[key]);
  });

  return result;
}
