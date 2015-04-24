# Ember-i18next

## About

An [Ember CLI](http://www.ember-cli.com/) addon for internationalizing Ember.js applications using the [i18next](http://i18next.com/) library.

**This addon is under development and is probably not suitable for production use, and so it has not been published to npm yet. Buyer beware.**

**Note:** This addon uses the Streams API, which is only present in Ember.js 1.9.0 and later. In particular, it targets the Stream and HTMLBars APIs available in Ember 1.10.0 and later. Earlier releases of Ember are not supported.

## Installation

To install with Ember CLI 0.2.0 or later (when published to npm):

```
ember install:addon ember-i18next
```

For older versions:

```
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

### Including Locale Files

By default, i18next loads locale files from the server asynchronously from the server path configured using the [`resGetPath`](http://i18next.com/pages/doc_init.html#getresources) configuration option. To copy your application's locale resources from your source tree to the expected path during build, modify the application's `Brocfile.js`:

```javascript
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp();

var locales = pickFiles('locales', {
  srcDir: '/',
  destDir:  '/locales'
});

module.exports = app.toTree(locales);
```

In this example, locale files are recursively copied from the application's `app/locales/` directory to `dist/locales/` when the application is built.

## Use

The addon provides a Handlebars helper for displaying localized text in templates and injects a utility function into routes, controllers, and components. The language that the application is displayed in is controlled by the `locale` property on the main Ember application object.

### Handlebars Helper

You can access your app's translations in templates using the `t` helper:

```handlebars
<button type="button">{{t 'button.text'}}</button>
```

Pass values to be interpolated into the translation as [hash arguments](http://handlebarsjs.com/expressions.html). For example, for a translation that includes an interpolated `__count__` value:

```handlebars
<div>{{t 'messages.count' count=3}}</div>
```

### Utility Function

The `t()` utility function is automatically injected into routes, controllers, and components, so you can do the following:

```javascript
// app/controllers/example-controller.js
import Ember from 'ember';

export default Ember.Controller.extend({
  example: function () {
    return this.t('messages.count', { count: 3 });
  }
});
```

To use the `t()` utility elsewhere, look it up in the container:

```javascript
import Ember from 'ember';

export default Ember.Object.extend({
	example: function () {
	  var t = this.container.lookup('utils:t');
	  return t('messages.count', { count: 3 });
	}
});
```

### Current Locale

The current locale is exposed via a `locale` property added to the main Ember application object. To change the language that the appliction is displayed in, simply set this property, and all of the text displayed using the `t` helper will be updated. For example, triggering the following controller action would update all of the text to Thai:

```javascript
// app/controllers/example-controller.js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    gimmeThai: function () {
      var app = this.container.lookup('application:main');
      app.set('locale', 'th-TH');
    }
  }
});
```

## Collaborating

Contributions are happily accepted. Make sure that your pull request includes tests and your JavaScript source is styled as described in the [Ember.js JavaScript style guide](https://github.com/emberjs/ember.js/blob/master/STYLEGUIDE.md).

## Acknowledgements

The use of streams to update the user interface when the locale is changed is adapted from the [ember-cli-i18n](https://github.com/dockyard/ember-cli-i18n) addon.
