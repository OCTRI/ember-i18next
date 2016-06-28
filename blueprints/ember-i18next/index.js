module.exports = {
  description: 'Adds i18next dependency to the app.',

  normalizeEntityName: function () {},

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      {name:'i18next-xhr-backend', target:'^0.6.0'},
      {name:'i18next', target:'^3.3.1'}
    ]);
  }
};
