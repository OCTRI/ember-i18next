/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/i18next.js');
    this.import('vendor/shims/i18next.js');
    this.import('vendor/i18nextXHRBackend.js');
    this.import('vendor/shims/i18next-xhr-backend.js');
  },

  treeForVendor(vendorTree) {
    var i18nextTree = new Funnel(
      path.dirname(require.resolve('i18next/i18next.js')),
      {
        files: ['i18next.js'],
      }
    );

    var backendTree = new Funnel(
      path.dirname(require.resolve('i18next-xhr-backend/i18nextXHRBackend.js')),
      {
        files: ['i18nextXHRBackend.js'],
      }
    );

    return new MergeTrees([vendorTree, i18nextTree, backendTree]);
  },
};
