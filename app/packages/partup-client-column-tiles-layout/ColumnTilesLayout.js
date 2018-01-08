Template.ColumnTilesLayout.onCreated(function() {
  let template = this;
  template.firstBlockSettings = new ReactiveVar(
    template.data.firstBlockSettings
  );
  template.rendered = new ReactiveVar(false);
});
Template.ColumnTilesLayout.onRendered(function() {
  let template = this;
  template.rendered.set(true);
  _.defer(function() {
    template.data.instance.initialize(template);
  });
});

Template.ColumnTilesLayout.helpers({
  firstBlockSettings: function() {
    let template = Template.instance();
    return template.firstBlockSettings.get();
  },
  columns: function() {
    if (!this.instance.initialized.get()) return [];
    let columnsArray = this.instance.columns.get();
    let columns = [];
    _.each(columnsArray, function(item, index) {
      return (columns[index] = {
        items: item,
        index: index,
      });
    });
    return columns;
  },
  rendered: function() {
    return Template.instance().rendered.get();
  },
  columnWidth: function() {
    return (
      100 / Template.instance().data.instance.columns.get().length
    ).toFixed(1);
  },
  columnWidthCorrection: function() {
    let template = Template.instance();
    let margin = 20;
    let instance = template.data.instance;
    if (!instance.initialized.get()) return margin * 3 / 4;
    let columnsArray = instance.columns.get();

    return margin * (columnsArray.length - 1) / columnsArray.length;
  },
});
