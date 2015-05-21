import Ember from 'ember';
import I18nMixin from '../mixins/i18n';

export default Ember.Route.extend(I18nMixin, {
  beforeModel: function () {
    var i18next = this.get('i18n');
    return i18next.initLibraryAsync();
  }
});
