module.exports = {
  description: 'Adds i18next dependency to the app.',

  normalizeEntityName: function () {},

  afterInstall: function(options) {
    return this.addBowerPackageToProject('i18next');
  }
};
