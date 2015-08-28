# Changelog

## 1.0.0 2015/08/27

### Breaking

Includes changes needed to work with Ember 1.13, 2.0, and 2.1, and canary. Does not support versions of Ember prior to 1.13.

## 1.0.0-beta.1 Not released.

Included changes needed to work with Ember 1.13 and Ember 2.0 and fixes deprecations.

## 0.3.1 2015/06/09

Includes updates due to transfer to OCTRI organization. No code changes are included.

## 0.3.0 2015/06/09

Adds hooks that run around initialization of the i18next library. Any registered actions will be run when the i18next library is initialized as a result of a call to `initLibraryAsyc` or changing the locale.

To register a function to run before the i18next library is initialized, use the i18n service's `registerPreInitAction` method. Similarly, to register a function to run after the i18next library is initialized, use the `registerPostInitAction` method. Pre- and post-init actions can be unregistered using the `unregisterPreInitAction` / `unregisterPostInitAction` methods.

See the [README](https://github.com/heathharrelson/ember-i18next/blob/33e55a857b4daadfc25bbbe8322053c62f731425/README.md) for details and examples.

## 0.3.0-beta.3 2015/05/27

Fixes an issue introduced in 0.3.0-beta.2 where the i18n service's locale property was not getting initialized.

## 0.3.0-beta.2 2015/05/26

Fixes a race condition where post-init actions were being called before library initialization completed after a change in locale.

## 0.3.0-beta.1 2015/05/26

Adds experimental hooks that run around initialization of the i18next library.  Any registered actions will be run when the i18next library is initialized as a result of a call to `initLibraryAsyc` or changing the locale.

To register a function to run before the i18next library is initialized, use the i18n service's `registerPreInitAction` method. Similarly, to register a function to run after the i18next library is initialized, use the `registerPostInitAction` method. Pre- and post-init actions can be unregistered using the `unregisterPreInitAction` / `unregisterPostInitAction` methods.

## 0.2.0 2015/05/08

To make working with i18next's capabilities easier and better encapsulate the library, the i18n service now exports all of i18next's public API. With this change, code like the following:

```javascript
import Ember from 'ember';
import I18nMixin from '../mixins/i18n';

export default Ember.Route.extend(I18nMixin, {
  // ...
  afterModel: function (model) {
    var translations = model.get('translations');
    var i18next = this.get('i18n.i18next');
    i18next.addResources(translations.get('locale'), 'namespace', translations.get('keys'));
  }
});
```

Can be replaced with this instead:

```javascript
import Ember from 'ember';
import I18nMixin from '../mixins/i18n';

export default Ember.Route.extend(I18nMixin, {
  // ...
  afterModel: function (model) {
    var translations = model.get('translations');
    var i18n = this.get('i18n');
    i18n.addResources(translations.get('locale'), 'namespace', translations.get('keys'));
  }
});
```

## 0.1.0 2015/04/30

Restructures the addon so that the internationalization capabilities provided by i18next are exposed through an Ember service object. In addition, a mixin is provided that injects the service into the including class.

This release also removes all XHR requests from the initializer. Applications using the addon should now use the service's `initLibraryAsync()` method to initialize i18next in a route.

See [the pull request](https://github.com/heathharrelson/ember-i18next/pull/7) for the complete changes included.

## 0.0.3 2015/04/27

Fixes issue #5, allowing the HTMLBars helper to work with Ember.js 1.11.x.


## 0.0.2 2015/04/27

Updates requirements and tests to work with Ember CLI 0.2.x.

## 0.0.1 2015/04/27

Initial working release with support for bound parameters.
