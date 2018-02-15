(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['i18nextXHRBackend'],
      __esModule: true,
    };
  }

  define('i18next-xhr-backend', [], vendorModule);
})();
