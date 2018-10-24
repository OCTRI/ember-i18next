# Changelog

## 3.0.0

Updates dependencies and migrates to use the new Ember testing APIs.

### Breaking

ember-i18next 3.0.0 drops support for Ember 1.13. The addon has been tested with Ember 2.16 LTS, 2.18 LTS and Ember 3.x, but it should work down to version 2.3.

Version 3.0.0 also updates the i18next dependency to version 11, which contains breaking changes. Review [the i18next migration guide](https://www.i18next.com/misc/migration-guide.html) prior to upgrading.

### Changes Included

* PR #56: Use the new Ember testing API.
* PR #57: Update addon dependency to Ember 3.4.
* PR #58: Update to the latest i18next and i18next-xhr-backend.

## 2.1.1

Updates dependencies.

### Changes Included

* PR #55: Update addon dependencies.

## 2.1.0 2018/04/24

Updates depdendencies and adds a new computed property macro for translated text. See README.md for details on using the new macro.

### Changes Included

* PR #54: Update addon depdendency to Ember 3.0.
* PR #52: Add computed property macro.

## 2.0.0 2018/03/01

Updates dependencies and uses the [Ember.js modules API introduced in Ember 2.16](https://emberjs.com/blog/2017/10/11/ember-2-16-released.html).

### Breaking

ember-i18next 2.0.0 updates the i18next dependency to version 10, which contains breaking changes. Review the README.md and [the i18next migration guide](https://www.i18next.com/misc/migration-guide.html) prior to upgrading.

### Changes included

* PR #45: Remove use of Bower.
* PR #47: Remove use of Browserify.
* PR #48: Move code to the `addon` directory.
* PR #50: Update dependencies and use the new Ember modules API.

## 2.0.0-beta.2 2016/09/05

### Breaking

Ember-i18next 2 updates the i18next dependency to version 3, which contains breaking changes. Review the README.md and [the i18next migration guide](http://i18next.com/docs/migration/) prior to upgrading.

### Changes included

* PR #41: For compatibility with Ember 2.9, do not modify the positional parameters passed to the `{{t}}` helper.

## 2.0.0-beta.1 2016/07/07

### Breaking

Updates the i18next dependency to version 3, which contains breaking changes. Review the README.md and [the i18next migration guide](http://i18next.com/docs/migration/) prior to upgrading.

### Changes included

* PR #32: Update to use i18next 3. Thanks to @john-coffey for implementing this.
* PR #33: Return a safe string from the `{{t}}` helper, allowing translations to contain markup.
* Miscellaneous code and documentation cleanup: #28, #29, #31, #36.

## 1.1.1 2016/01/15

Specify the version string to add to the bower.json when the addon is installed, preventing broken builds (see issue #25).

## 1.1.0 2015/12/16

Now passes a locale to the pre- and post-init actions, allowing them to perform work that depends on the locale, such as loading or unloading additional resources. The new locale is passed to pre-init actions, and the old locale is passed to post-init actions. See #24 for details. Thanks to @mpirio for making this happen.

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
