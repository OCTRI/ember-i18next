import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import I18nMixin from '../mixins/i18n';

export default Route.extend(I18nMixin, {
  countObj: EmberObject.create({ count: 1000 }),

  beforeModel() {
    const i18next = this.get('i18n');
    return i18next.initLibraryAsync();
  },

  model() {
    return this.get('countObj');
  },

  actions: {
    changeLanguage(lang) {
      const service = this.get('i18n');
      service.set('locale', lang);
    },

    changeCount(count) {
      this.get('countObj').set('count', count);
    }
  }
});
