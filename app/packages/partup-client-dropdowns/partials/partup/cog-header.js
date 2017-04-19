Template.PartupCogWheel.onCreated(function () {
    var template = this
    template.dropdownOpen = new ReactiveVar(false)
    template.partup = template.data.partup;
})

Template.PartupCogWheel.onRendered(function () {
    var template = this
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=partupsettings]')
    Router.onBeforeAction(function (req, res, next) {
        template.dropdownOpen.set(false)
        next()
    })
})

Template.PartupCogWheel.onDestroyed(function () {
    var template = this
    ClientDropdowns.removeOutsideDropdownClickHandler(template)
})

Template.PartupCogWheel.helpers({
    menuOpen: function () {
        return Template.instance().dropdownOpen.get()
    }
})

Template.PartupCogWheel.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-endpartnership]': function (event, template) {
        event.preventDefault()

        Partup.client.prompt.confirm({
            title: 'Are you sure you want to stop being a partner on' + template.partup.name,
            confirmButton: TAPi18n.__('pages-app-network-confirmation-confirm-button'),
            cancelButton: TAPi18n.__('pages-app-network-confirmation-cancel-button'),
            onConfirm: function () {
                template.partup.makePartnerSupporter(Meteor.user()._id)

                //This subscription should be used to change from partner to supporter.
                //template.subscribe('partner.unpartner')
            }
        });
    }
})