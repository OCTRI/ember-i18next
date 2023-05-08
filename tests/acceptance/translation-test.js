import { click, findAll, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance: Translation', function (hooks) {
  setupApplicationTest(hooks);

  test('English translations are correct', async function (assert) {
    await visit('/');
    await click('a#change-language-en');
    await click('a#change-count-1000');

    assert.equal(find('div#translated').textContent, 'test output');
    assert.equal(find('div#translated-with-args0').textContent, '0 frogs');
    assert.equal(find('div#translated-with-args1').textContent, '1 frog');
    assert.equal(find('div#translated-with-args3').textContent, '3 frogs');
    assert.equal(
      find('div#translated-with-bound-args').textContent,
      '1000 frogs'
    );
  });

  test('Changing locale changes text', async function (assert) {
    await visit('/');
    await click('a#change-language-th');
    await click('a#change-count-1000');

    assert.equal(find('div#translated').textContent, 'thai test output');
    assert.equal(find('div#translated-with-args0').textContent, 'thai 0 frog');
    assert.equal(find('div#translated-with-args1').textContent, 'thai 1 frog');
    assert.equal(find('div#translated-with-args3').textContent, 'thai 3 frog');
    assert.equal(
      find('div#translated-with-bound-args').textContent,
      'thai 1000 frog'
    );
  });

  test('Changing bound params changes text', async function (assert) {
    await visit('/');
    await click('a#change-language-en');
    await click('a#change-count-1000');

    assert.equal(
      find('div#translated-with-bound-args').textContent,
      '1000 frogs'
    );

    await click('a#change-count-5000');

    assert.equal(
      find('div#translated-with-bound-args').textContent,
      '5000 frogs'
    );
  });

  test('Markup is allowed in translation keys but substitutions are escaped', async function (assert) {
    await visit('/');
    await click('a#change-language-en');

    assert.equal(
      findAll('div#translated-with-markup b').length,
      1,
      'there should be a bold tag'
    );
    assert.equal(
      findAll('div#translated-with-markup-malicious script').length,
      0,
      '<script> tag in content should be escaped and not be rendered'
    );
  });
});
