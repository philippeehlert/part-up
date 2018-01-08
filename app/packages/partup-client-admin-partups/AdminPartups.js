Template.AdminPartups.onCreated(function() {
  let template = this;
  template.partups = new ReactiveVar([]);
  template.page = 0;
  template.limit = 20;

  template.currentPartup = new ReactiveVar();

  Meteor.call(
    'partups.admin_all',
    {},
    {
      page: template.page,
      limit: template.limit,
    },
    function(error, results) {
      template.page = 1;
      template.partups.set(results);
    }
  );
});

/** ***********************************************************/
/* Page helpers */
/** ***********************************************************/
Template.AdminPartups.helpers({
  partups: function() {
    return Template.instance().partups.get();
  },
  creatorById: function(id) {
    return Meteor.users.findOne(id);
  },
  currentPartup: function() {
    return Template.instance().currentPartup.get();
  },
});

/** ***********************************************************/
/* Page events */
/** ***********************************************************/
Template.AdminPartups.events({
  'click [data-toggle]': function(event) {
    event.preventDefault();
    $(event.currentTarget)
      .next('[data-toggle-target]')
      .toggleClass('pu-state-active');
    $('[data-toggle-target]')
      .not($(event.currentTarget).next('[data-toggle-target]')[0])
      .removeClass('pu-state-active');
  },
  'click [data-expand]': function(event) {
    $(event.currentTarget).addClass('pu-state-expanded');
  },
  'click [data-delete]': function(event, template) {
    alert('not yet implemented');
  },
  'click [data-change-tribe]': function(event, template) {
    template.currentPartup.set(this);
    Partup.client.popup.open({
      id: 'popup.admin-change-tribe',
    });
  },
  'submit .partupsearch': function(event, template) {
    event.preventDefault();
    template.page = 0;
    let query = template.find('[data-partupsearchfield]').value;
    Meteor.call(
      'partups.admin_all',
      {
        name: { $regex: query, $options: 'i' },
      },
      {
        limit: 100,
        page: template.page,
      },
      function(error, results) {
        template.partups.set(results);
      }
    );
  },
  'click [data-showmore]': function(event, template) {
    Meteor.call(
      'partups.admin_all',
      {},
      {
        page: template.page,
        limit: template.limit,
      },
      function(error, results) {
        let currentPartups = template.partups.get();
        let newPartupsList = currentPartups.concat(results);
        template.partups.set(newPartupsList);
        template.page++;
      }
    );
  },
});
