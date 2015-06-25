# Ember-i18next [![Build Status](https://travis-ci.org/OCTRI/ember-i18next.svg)](https://travis-ci.org/OCTRI/ember-i18next)

## About

An [Ember CLI](http://www.ember-cli.com/) addon for internationalizing Ember.js applications using the [i18next](http://i18next.com/) library. The addon provides an Ember service that wraps i18next and a Handlebars helper for displaying localized text in templates.

This branch only includes support for Ember.js 1.13 and 2.0. For earlier versions of Ember, see [the latest 0.3.x release](https://github.com/OCTRI/ember-i18next/releases/tag/v0.3.1).

## Installation

To install with Ember CLI >= 0.2.3:

```bash
ember install ember-i18next
```

To install with Ember CLI 0.1.5 - 0.2.2:

```bash
ember install:addon ember-i18next
```

For older versions:

```bash
npm install --save-dev ember-i18next
bower install --save i18next
```

## Configuration

### Configuring i18next

To configure the default locale and the [options used to initialize i18next](http://i18next.com/pages/doc_init.html), you can add them to your `environment.js`:

```javascript
// ...
var ENV = {
  // ...
  defaultLocale: 'en-US',
  i18nextOptions: {
    // any options supported by i18next
  },
  APP: {
    // ...
  }
}
```

If you do not specify any options, the default i18next options will be used.

### Initializing i18next

To initialize the i18next library, call the i18n service's `initLibraryAsync` method. This method returns a promise that resolves when the library finishes initializing, so if you call it in one of the model hook methods (`beforeModel`, `model`, `afterModel`), the application will enter the loading substate until i18next is initialized.

### Including Locale Files

By default, i18next loads locale files from the server asynchronously from the server path configured using the [`resGetPath`](http://i18next.com/pages/doc_init.html#getresources) configuration option. To copy your application's locale resources from your source tree to the expected path during build, modify the application's `Brocfile.js`:

```javascript
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var funnel = require('broccoli-funnel');

var app = new EmberApp();

var locales = funnel('app/locales', {
  srcDir: '/',
  destDir:  '/locales'
});

module.exports = app.toTree(locales);
```

In this example, locale files are recursively copied from the application's `app/locales/` directory to `dist/locales/` when the application is built.

## Use

### Service

If you need to produce translated strings in routes, components or controllers, you can inject the `i18n` service using the [Ember.inject API](http://emberjs.com/api/classes/Ember.inject.html). This will then give access to i18next's `t()` function in your code. For example:

```javascript
// app/components/example-component.js
import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  messages: someObject,

  messageCount: Ember.computed('messages', function () {
    var i18n = this.get('i18n');
    var count = this.get('messages.count');
    return i18n.t('messages.count', { msgCount: count });
  }
});
```

For convenience, a mixin is provided that injects the i18n service and adds a `t()` function to the including class. For example, the above could be accomplished using the mixin like this:

```javascript
// app/components/example-component.js
import Ember from 'ember';
import I18nMixin from 'mixins/i18n';

export default Ember.Component.extend(I18nMixin, {
  messages: someObject,

  messageCount: Ember.computed('messages', function () {
    var count = this.get('messages.count');
    return this.t('messages.count', { msgCount: count })
  });
});
```

### Handlebars Helper

You can access your app's translations in templates using the `t` helper:

```handlebars
<button type="button">{{t 'button.text'}}</button>
```

Pass values to be interpolated into the translation as [hash arguments](http://handlebarsjs.com/expressions.html). For example, for a translation that includes an interpolated `__count__` value:

```handlebars
<div>{{t 'messages.count' count=3}}</div>
```

### Current Locale

The current locale is exposed via a `locale` property added to the i18n service. To change the language that the appliction is displayed in, simply set this property, and all of the text displayed using the `t` helper will be updated. For example, triggering the following controller action would update all of the text to Thai:

```javascript
// app/controllers/example-controller.js
import Ember from 'ember';

export default Ember.Controller.extend(I18nMixin, {
  actions: {
    gimmeThai: function () {
      this.set('i18n.locale', 'th-TH');
    }
  }
});
```

### Pre- and Post-Init Actions

Changing the locale causes i18next to be reinitialized, which can destroy state. For example, if you have used `addResources` to load additional localization strings, they will be lost during initialization. To handle management of state around library initialization, you can register actions to perform before and after library initialization with the i18n service using the `registerPreInitAction` and `registerPostInitAction` methods.

```javascript
import Ember from 'ember';
import I18nMixin from '../mixins/i18n';

export default Ember.Route.extend(I18nMixin, {
  init: function () {
    this._super();
    var i18n = this.get('i18n');

    // preload-special is a name that can be used to unregister the action later
    i18n.registerPostInitAction('preload-special', function () {
      // do preloading
    });
  }
}
```

Pre- or post-init actions may return a promise. If any of the actions returns a promise, the service will wait for the promises to resolve before moving on. If pre-init actions return promises, the service will wait for them to resolve before initializing i18next. If post-init actions return promises, the service will wait for them to resolve before notifying the application about the change in locale.

Finally, actions may be unregistered using the `unregisterPreInitAction` and `unregisterPostInitAction` methods. To unregister the post-init action from the previous example, you would do the following:

```javascript
// ...
i18n.unregisterPostInitAction('preload-special');
// ...
```

## Collaborating

Contributions are happily accepted. Make sure that your pull request includes tests and your JavaScript source is styled as described in the [Ember.js JavaScript style guide](https://github.com/emberjs/ember.js/blob/master/STYLEGUIDE.md).

## Acknowledgements

The use of streams to update the user interface when the locale is changed is adapted from the [ember-cli-i18n](https://github.com/dockyard/ember-cli-i18n) addon.
