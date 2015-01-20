import Ember from 'ember';

var bind = Ember.run.bind;

function T(attributes) {
  Ember.debug('T attributes:');

  for(var key in attributes) {
    this[key] = attributes[key];
  }

  this.t = function(path, values) {
    var application = this.container.lookup('application:main');
    var i18n = application.get('i18n');
    var countryCode = application.localeStream.value();

    if (!Ember.isArray(values)) {
      values = Array.prototype.slice.call(arguments, 1);
    }

    if (!countryCode) {
      countryCode = application.defaultLocale;
    }

    return i18n.t(path);
  };
}

T.create = function(attributes) {
  var t = new T(attributes);
  var fn = bind(t, t.t);
  fn.destroy = function() {};
  return fn;
};

export default T;
