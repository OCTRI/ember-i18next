(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['i18next'],
      __esModule: true,
    };
  }

  define('i18next', [], vendorModule);
})();
