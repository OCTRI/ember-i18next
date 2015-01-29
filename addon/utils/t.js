import Ember from 'ember';
import { read, readHash } from 'ember-i18next/utils/stream';

var bind = Ember.run.bind;

function T(attributes) {
  for(var key in attributes) {
    this[key] = attributes[key];
  }

  this.t = function(path, values) {
    var application = this.container.lookup('application:main');
    var i18n = application.get('i18n');
    var countryCode = application.localeStream.value();

    if (!countryCode) {
      countryCode = application.defaultLocale;
    }

    return i18n.t(read(path), readHash(values));
  };
}

T.create = function(attributes) {
  var t = new T(attributes);
  var fn = bind(t, t.t);
  fn.destroy = function() {};
  return fn;
};

export default T;
