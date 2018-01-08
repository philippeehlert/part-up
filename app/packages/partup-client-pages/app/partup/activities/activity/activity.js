// jscs:disable
/**
 * Widget to render a single activity
 *
 * You can pass the widget a few options which enable various functionalities
 *
 * @module client-activity
 * @param {Object} activity   The activity to render
 * @param {Function} createCallback   A function which is executed after a new activity has been added
 * @param {String} contribution_id   Contribution id to render, if only one should be rendered
 * @param {Boolean} COMMENTS_LINK   Whether the activity should display the link to comments
 * @param {Boolean} CREATE   Whether the activity should be shown in create mode
 * @param {Boolean} EXPANDABLE   Whether the activity should be able to expand
 * @param {Boolean} EXPANDED   Whether the activity should render in expanded state
 * @param {Boolean} POPUP   Whether the activity is being rendered inside of a modal
 * @param {Boolean} READONLY   Whether the activity should contain an edit mode
 * @param {Boolean} CREATE_PARTUP   Whether the activity is being rendered in the start partup flow
 * @param {Boolean} UPDATE_LINK   Whether to show the update hyperlink
 */
// jscs:enable

/** ***********************************************************/
/* Widget initial */
/** ***********************************************************/
Template.Activity.onCreated(function() {
  this.edit = new ReactiveVar(false);
  this.showContributions = new ReactiveVar(false);
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.Activity.helpers({
  createCallback: function() {
    return this.createCallback;
  },
  edit: function() {
    return Template.instance().edit;
  },
  showForm: function() {
    return !this.READONLY && (!!this.CREATE || Template.instance().edit.get());
  },
  editActivityFormId() {
    return this.activity ? `edit-activity-${this.activity._id}` : undefined;
  },
});
