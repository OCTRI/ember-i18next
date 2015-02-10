import Ember from 'ember';

export default Ember.Route.extend({
  countObj: Ember.Object.create({ count: 1000 }),
  model: function () {
    return this.get('countObj');
  },
  actions: {
    changeLanguage: function () {
      var app = this.container.lookup('application:main');
      app.set('locale', 'th');
    },
    changeCount: function () {
      this.get('countObj').set('count', 5000);
    }
  }
});
