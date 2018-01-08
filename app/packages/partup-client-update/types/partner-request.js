Template.update_partups_partner_request.helpers({
  userIsPartner: function() {
    let template = Template.instance();
    let partupId = template.data.partup_id;
    return User(Meteor.user()).isPartnerInPartup(partupId);
  },
  upperIsAlreadyPartner: function(upperId) {
    let template = Template.instance();
    let partupId = template.data.partup_id;
    return User(Meteor.users.findOne(upperId)).isPartnerInPartup(partupId);
  },
});

Template.update_partups_partner_request.events({
  'click [data-accept]': function(event, template) {
    Meteor.call('partups.partner_accept', template.data._id);
  },
  'click [data-decline]': function(event, template) {
    Meteor.call('partups.partner_reject', template.data._id);
  },
});
