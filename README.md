# ember-i18next
![Build Status](https://github.com/OCTRI/ember-i18next/workflows/CI/badge.svg)

## About

An [Ember CLI](http://www.ember-cli.com/) addon for internationalizing Ember.js applications using the [i18next](http://i18next.com/) library. The addon provides an Ember service that wraps i18next and a Handlebars helper for displaying localized text in templates.

## Compatibility

ember-i18next supports current Ember (release, beta, canary) and the last two LTS releases.

## Installation

To install with Ember CLI:

```bash
ember install ember-i18next
```

## Configuration

### Configuring i18next

To configure the [i18next options](https://www.i18next.com/configuration-options.html) and the [XHR backend options](https://github.com/i18next/i18next-xhr-backend#backend-options), add them to your `environment.js`:

```javascript
// ...
let ENV = {
  // ...
  i18nextOptions: {
    // any options supported by i18next
    backend: {
      // any options supported by i18next-xhr-backend
    },
    // set to true if you want to catch errors when initializing i18next
    rejectError: false
  },
  APP: {
    // ...
  }
}
```

If you do not specify any options, the default i18next options will be used.

### Initializing i18next

To initialize the i18next library, call the i18n service's `initLibraryAsync` method. This method returns a promise that resolves when the library finishes initializing, so if you call it in one of the model hook methods (`beforeModel`, `model`, `afterModel`), the application will enter the loading substate until i18next is initialized. The application route may be a good place to do this.

#### Handling Initialization Errors

By default, this addon will catch any initialization errors and display a warning in the console. If you want to catch and handle the errors, set the `rejectError` option to true and handle the errors in a `catch` block.

```javascript
// app/routes/application.js
import Route from '@ember/routing/route';

export default Route.extend({
  
  beforeModel() {
    return this.get('i18n')
      .initLibraryAsync()
      // only if `rejectError` option is set to true
      .catch(errors => this.transitionTo('my-error-page', errors));
  }

});
```

### Including Locale Files

By default, i18next loads locale files from the server asynchronously from the server path configured using the XHR backend's [`loadPath`](https://github.com/i18next/i18next-xhr-backend#backend-options) configuration option. To copy your application's locale resources from your source tree to the expected path during build, modify the application's `ember-cli-build.js`:

```javascript
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    // build options
  });

  const locales = funnel('app/locales', {
    srcDir: '/',
    destDir: '/locales'
  });

  // other configuration, app.import() calls, etc. ...

  return app.toTree(locales);
}
```

In this example, [Broccoli Funnel](https://github.com/broccolijs/broccoli-funnel) recursively copies locale files from the application's `app/locales/` directory to `dist/locales/` when the application is built.

## Use

### Service

If you need to produce translated strings in routes, components or controllers, you can [inject the `i18n` service](https://guides.emberjs.com/v3.17.0/applications/dependency-injection/#toc_ad-hoc-injections). This will then give access to [i18next's `t()` function](https://www.i18next.com/essentials.html) in your code. For example:

```javascript
// app/components/example-component.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  i18n: service(),
  messages: someObject,

  messageCount: computed('messages', function () {
    const i18n = this.get('i18n');
    const count = this.get('messages.count');
    return i18n.t('messages.count', { msgCount: count });
  }
});
```

For convenience, a mixin is provided that injects the i18n service and adds a `t()` function to the including class. For example, the above could be accomplished using the mixin like this:

```javascript
// app/components/example-component.js
import Component from '@ember/component';
import { computed } from '@ember/object';

import I18nMixin from 'ember-i18next/mixins/i18n';

export default Component.extend(I18nMixin, {
  messages: someObject,

  messageCount: computed('messages', function () {
    const count = this.get('messages.count');
    return this.t('messages.count', { msgCount: count })
  });
});
```

### Handlebars Helper

You can access your app's translations in templates using the `t` helper:

```handlebars
<button type="button">{{t 'button.text'}}</button>
```

Pass values to be interpolated into the translation as [hash arguments](http://handlebarsjs.com/guide/expressions.html#helpers-with-hash-arguments). For example, for a translation that includes an interpolated `{{count}}` value:

```handlebars
<div>{{t 'messages.count' count=model.messageCount}}</div>
```

### Macro

You can create computed properties that watch for locale changes:

```js
import { translationMacro as t } from "ember-i18next";

export default Ember.Component.extend({
  // A simple translation.
  title: t('user.edit.title'),

  followersCount: 1,
  count: Ember.computed.alias('followersCount'),

  // A translation with interpolations. This computed property
  // depends on `count` and will send `{ count: this.get('count') }`
  // in to the translation.
  followersTitle: t('user.followers.title', 'count')
});
```

The macro relies on this.get('i18n') being the `service:i18n`. Make sure it is injected somehow.

### Current Locale

The current locale is exposed via i18n service's `locale` property. To change the language that the application is displayed in, simply set this property, and all of the text displayed using the `t` helper will be updated. For example, triggering the following controller action would update all of the text to Thai:

```javascript
// app/controllers/example-controller.js
import Controller from '@ember/controller';
import I18nMixin from 'ember-i18next/mixins/i18n';

export default Controller.extend(I18nMixin, {
  actions: {
    showThai() {
      this.set('i18n.locale', 'th-TH');
    }
  }
});
```

### Pre- and Post-Init Actions

Changing the locale causes i18next to be reinitialized, which can destroy state. For example, if you have used `addResources` to load additional localization strings, they will be lost during initialization. To handle management of state around library initialization, you can register actions to perform before and after library initialization with the i18n service using the `registerPreInitAction` and `registerPostInitAction` methods.

```javascript
import Route from '@ember/routing/route';
import I18nMixin from 'ember-i18next/mixins/i18n';

export default Route.extend(I18nMixin, {
  init() {
    this._super();
    const i18n = this.get('i18n');

    // my-fancy-action is a name that can be used to unregister the action later
    i18n.registerPostInitAction('my-fancy-action', oldLang => {
      // do preloading
    });
  }
}
```

Pre- or post-init actions may return a promise. If any of the actions returns a promise, the service will wait for the promises to resolve before moving on. If pre-init actions return promises, the service will wait for them to resolve before initializing i18next. If post-init actions return promises, the service will wait for them to resolve before notifying the application about the change in locale.

The new locale is passed as a parameter to pre-init actions and the old locale to post-init actions. These parameters are `undefined` when the the i18n service's `initLibraryAsync` method is called.

Finally, actions may be unregistered using the `unregisterPreInitAction` and `unregisterPostInitAction` methods. To unregister the post-init action from the previous example, you would do the following:

```javascript
// ...
i18n.unregisterPostInitAction('my-fancy-action');
// ...
```

## Testing

### Acceptance Tests

No special configuration is required for acceptance testing, although it may be convenient to configure the default locale and preload locales for use in the tests. For example:

```javascript
// in environment.js
if (environment === 'test') {
  // ...
  ENV.i18nextOptions.lng = 'en-US';
  ENV.i18nextOptions.preload = ['en-US', 'th-TH'];
}
```

### Component Integration Tests

If you need to make assertions about the text rendered in component integration tests, you can [initialize the i18n service in a `beforeEach` hook](https://github.com/OCTRI/ember-i18next/issues/31).

```javascript
moduleForComponent('some-component', 'Integration | Component | some component', {
  integration: true,

  beforeEach(assert) {
    const done = assert.async();
    this.inject.service('i18n');
    this.get('i18n').initLibraryAsync().then(done);
  }
});
```

### Unit Tests

Unit tests for objects that inject the i18n service or use the `{{t}}` helper should add them to the `needs` array.

```javascript
moduleForComponent('other-component', 'Unit | Component | other component', {
  unit: true,
  needs: ['service:i18n', 'helper:t'],
});
```

## Collaborating

Contributions are happily accepted. Make sure that your pull request includes tests and your JavaScript source is styled as described in the [Ember.js JavaScript style guide](https://github.com/emberjs/ember.js/blob/master/STYLEGUIDE.md).

## Acknowledgements

Early versions of this addon were strongly influenced by the  [ember-cli-i18n](https://github.com/dockyard/ember-cli-i18n) addon.
