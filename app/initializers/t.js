import Ember from 'ember';
import tHelper from '../helpers/t';

export function initialize(/* container, application */) {
  // TODO: investigate a way to avoid using this private method
  var registerHelper = Ember.HTMLBars._registerHelper;

  // Note: We have to do this ourselves because the helper
  // needs to manipulate the stream itself, so
  // Ember.HTMLBars.makeBoundHelper can't be used.
  registerHelper('t', tHelper);
}

export default {
  name: 't',
  initialize: initialize
};
