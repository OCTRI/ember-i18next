import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { translationMacro as t } from 'ember-i18next';
import EmberObject from '@ember/object';

let service;

module('Unit | Utils | translationMacro', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    service = this.owner.lookup('service:i18n');

    return service.initLibraryAsync().then(() => {
      this.object = EmberObject.extend({
        i18n: service,
        numberClicks: 9,
        tMacroNoInterpolation: t('macro_no_interpolations'),
        tMacroWithInterpolation: t('macro_with_interpolations', { clicks: 'numberClicks' })
      }).create();
    })
  });

  test('defines a computed property that translates without interpolations', function (assert) {
    assert.equal(this.object.get('tMacroNoInterpolation'), 'text with no interpolations');
  });

  test('defines a computed property that translates with interpolations', function (assert) {
    assert.equal(this.object.get('tMacroWithInterpolation'), 'Clicks: 9');
  });

  test('defines a computed property with dependencies', function (assert) {
    run(this.object, 'set', 'numberClicks', 13);
    assert.equal(this.object.get('tMacroWithInterpolation'), 'Clicks: 13');
  });

  test('defines a computed property that depends on the locale', function (assert) {
    assert.equal(this.object.get('tMacroNoInterpolation'), 'text with no interpolations');
    run(this.object, 'set', 'i18n.locale', 'th');
    assert.equal(this.object.get('tMacroNoInterpolation'), 'thai text with no interpolations');
  });
});
