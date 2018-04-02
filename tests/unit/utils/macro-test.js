import { module, test } from 'ember-qunit';
import { run } from '@ember/runloop';
import { translationMacro as t } from 'ember-i18next';
import destroyApp from '../../helpers/destroy-app';
import EmerObject from '@ember/object';
import startApp from '../../helpers/start-app';

let application, container, service;

module('Unit | Utils | translationMacro', {
  beforeEach() {
    application = startApp();
    container = application.__container__;
    service = container.lookup('service:i18n');

    return service.initLibraryAsync().then(() => {
      this.object = EmerObject.extend({
        i18n: service,
        numberClicks: 9,
        tMacroNoInterpolation: t('macro_no_interpolations'),
        tMacroWithInterpolation: t('macro_with_interpolations', { clicks: 'numberClicks' })
      }).create();
    })
  },

  afterEach() {
    destroyApp(application);
  }
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
