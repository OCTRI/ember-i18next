import Route from '@ember/routing/route';
import I18nMixin from '../mixins/i18n';

export default Route.extend(I18nMixin, {
  beforeModel() {
    const i18next = this.get('i18n');
    return i18next.initLibraryAsync();
  },
});
