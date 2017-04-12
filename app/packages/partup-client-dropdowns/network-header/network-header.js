Template.NetworkMenu.onCreated(function () {
    var template = this
    template.dropdownOpen = new ReactiveVar(false)
})

Template.NetworkMenu.onRendered(function () {
    var template = this
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=networksettings]')
    Router.onBeforeAction(function (req, res, next) {
        template.dropdownOpen.set(false)
        next()
    })
})

Template.NetworkMenu.onDestroyed(function () {
    var template = this
    ClientDropdowns.removeOutsideDropdownClickHandler(template)
})

Template.NetworkMenu.helpers({
    menuOpen: function () {
        return Template.instance().dropdownOpen.get()
    }
})

Template.NetworkMenu.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler
})
