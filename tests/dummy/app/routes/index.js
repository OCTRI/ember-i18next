import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    changeLanguage: function () {
      var app = this.container.lookup('application:main');
      app.set('locale', 'th');
    }
  }
});
