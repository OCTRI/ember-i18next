import Ember from 'ember';

var I18nMixin = Ember.Mixin.create({
  i18n: Ember.inject.service(),

  t: function (path, values) {
    return this.get('i18n').t(path, values);
  }
});

export default I18nMixin;
