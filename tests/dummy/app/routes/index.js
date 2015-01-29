import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return Ember.Object.create({ count: 1000 });
  },
  actions: {
    changeLanguage: function () {
      var app = this.container.lookup('application:main');
      app.set('locale', 'th');
    }
  }
});
