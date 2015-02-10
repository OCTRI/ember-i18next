import Stream from 'ember-i18next/utils/stream';
import { subscribe } from 'ember-i18next/utils/stream';

export default function tHelper(params, hash) {
  var path = params.shift();

  var container = this.container;
  var t = container.lookup('utils:t');
  var application = container.lookup('application:main');

  var stream = new Stream(function() {
    return t(path, hash);
  });

  var i, l, param, prop;

  // bind any arguments that are Streams
  for (i = 0, l = params.length; i < l; i++) {
    param = params[i];
    subscribe(param, stream.notify, stream);
  }

  for (prop in hash) {
    param = hash[prop];
    subscribe(param, stream.notify, stream);
  }

  subscribe(path, stream.notify, stream);
  subscribe(application.localeStream, stream.notify, stream);

  return stream;
}
