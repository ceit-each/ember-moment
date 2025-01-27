import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render } from '@ember/test-helpers';

module('moment-to-now', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.lookup('service:moment').changeLocale('en');
  });

  test('one arg (date)', async function (assert) {
    assert.expect(1);

    const momentService = this.owner.lookup('service:moment');
    this.setProperties({
      dateA: momentService.moment().subtract(3, 'day'),
    });

    await render(hbs`{{moment-to-now dateA}}`);
    assert.dom(this.element).hasText('in 3 days');
  });

  test('one arg (date, hideAffix=boolean)', async function (assert) {
    assert.expect(2);

    const momentService = this.owner.lookup('service:moment');
    this.setProperties({
      date: momentService.moment().subtract(3, 'day'),
    });

    await render(hbs`{{moment-to-now date hideAffix=true}}`);
    assert.dom(this.element).hasText('3 days');
    await render(hbs`{{moment-to-now date hideAffix=false}}`);
    assert.dom(this.element).hasText('in 3 days');
  });

  test('two args (date, inputFormat)', async function (assert) {
    assert.expect(1);

    const momentService = this.owner.lookup('service:moment');
    this.setProperties({
      format: 'LLLL',
      date: momentService.moment().subtract(3, 'day'),
    });

    await render(hbs`{{moment-to-now date format}}`);
    assert.dom(this.element).hasText('in 3 days');
  });

  test('change date input and change is reflected by bound helper', async function (assert) {
    assert.expect(2);

    const momentService = this.owner.lookup('service:moment');
    const context = EmberObject.create({
      date: momentService.moment().subtract(1, 'hour'),
    });

    this.set('context', context);
    await render(hbs`{{moment-to-now context.date}}`);
    assert.dom(this.element).hasText('in an hour');

    run(function () {
      context.set('date', momentService.moment().subtract(2, 'hour'));
    });

    assert.dom(this.element).hasText('in 2 hours');
  });

  test('can inline a locale instead of using global locale', async function (assert) {
    assert.expect(1);

    const momentService = this.owner.lookup('service:moment');
    this.set('date', momentService.moment().subtract(1, 'hour'));
    await render(hbs`{{moment-to-now date locale='es'}}`);
    assert.dom(this.element).hasText('en una hora');
  });

  test('can be called with null', async function (assert) {
    assert.expect(1);

    this.set('date', null);
    await render(hbs`{{moment-to-now date allow-empty=true}}`);
    assert.dom(this.element).hasText('');
  });

  test('can be called with null using global config option', async function (assert) {
    assert.expect(1);

    this.set('date', null);
    await render(hbs`{{moment-to-now date}}`);
    assert.dom(this.element).hasText('');
  });

  test('unable to called with null overriding global config option', async function (assert) {
    assert.expect(1);

    this.set('date', null);
    await render(hbs`{{moment-to-now date allow-empty=false}}`);
    assert.dom(this.element).hasText('Invalid date');
  });
});
