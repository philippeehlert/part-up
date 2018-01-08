/**
 * Run onRendered callback when the template is rendered
 */
Template.Columnslayout_Tile.onRendered(function() {
  let template = this;
  if (mout.lang.isFunction(this.data.onRendered)) {
    this.data.onRendered();
  }
});
