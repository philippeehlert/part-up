// jscs:disable
/**
 * Widget to render part-up settings
 *
 * You can pass the widget a few options which enable various functionalities
 *
 * @module client-partupsettings
 * @param {Object} currentPartup    the partup that will be prefilled in the form
 * @param {String} FORM_ID          the form id to be used in the autoform
 * @param {Boolean} CREATE          true: render in create mode, false: render in update mode
 */
// jscs:enable
var formId;
var formPlaceholders = {
    name: function() {
        return TAPi18n.__('partupsettings-form-name-placeholder');
    },
    description: function() {
        return TAPi18n.__('partupsettings-form-description-placeholder');
    },
    tags_input: function() {
        return TAPi18n.__('partupsettings-form-tags_input-placeholder');
    },
    end_date: function() {
        return TAPi18n.__('partupsettings-form-end_date-placeholder');
    },
    location_input: function() {
        return TAPi18n.__('partupsettings-form-location_input-placeholder');
    }
};

Template.Partupsettings.onCreated(function() {
    var template = this;

    template.nameCharactersLeft = new ReactiveVar(Partup.schemas.entities.partup._schema.partup_name.max);
    template.descriptionCharactersLeft = new ReactiveVar(Partup.schemas.entities.partup._schema.description.max);
    template.imageSystem = new ImageSystem(template);
    template.draggingFocuspoint = new ReactiveVar(false);
    template.selectedPrivacyLabel = new ReactiveVar('partupsettings-form-privacy-public');
    template.loading = new ReactiveDict();
    template.selectedLocation = new ReactiveVar();
    template.selectedType = new ReactiveVar(this.data.currentPartup ? this.data.currentPartup.type : '');
    template.selectedPhase = new ReactiveVar('');
    template.selectedPrivacyType = new ReactiveVar('');
    template.selectedPrivacyNetwork = new ReactiveVar('');
    template.tagsInputStates = new ReactiveDict();
    template.showNetworkDropdown = new ReactiveVar(false);
    template.currentCurrency = new ReactiveVar('EUR');
    template.formId = template.data.FORM_ID;
    template.preselectedNetwork = new ReactiveVar(undefined);
    template.locationHasValueVar = new ReactiveVar(undefined);

    template.subscribe('networks.list');

    template.autorun(function() {
        var partup = Template.currentData().currentPartup;
        if (!partup) return;

        if (partup.location && partup.location.place_id) template.selectedLocation.set(partup.location);

        if (partup.currency) template.currentCurrency.set(partup.currency);

        if (partup.image) {
            template.imageSystem.currentImageId.set(partup.image);
            template.imageSystem.uploaded.set(true);
        }

        template.selectedType.set(partup.type);
        template.selectedPhase.set(partup.phase);
    });

    template.setFocuspoint = function(focuspoint) {
        focuspoint.on('drag:start', function() {
            template.draggingFocuspoint.set(true);
        });
        focuspoint.on('drag:end', function(x, y) {
            template.draggingFocuspoint.set(false);
            template.imageSystem.storeFocuspoint(x, y);
        });
        template.focuspoint = focuspoint;
    };

    template.unsetFocuspoint = function() {
        template.focuspoint = undefined;
    };

    template.autorun(function() {
        var imageId = template.imageSystem.currentImageId.get();

        if (imageId && template.focuspoint) {
            template.focuspoint.reset();
        }
    });

});

Template.autoForm.onRendered(function() {
    var template = this.parent();
    if (template.view.name !== 'Template.Partupsettings') return;

    // Set the focuspoint input values to the form every time they change
    this.autorun(function() {
        if (!template.view.isRendered) return;

        var x = template.imageSystem.focuspoint.get('x');
        var y = template.imageSystem.focuspoint.get('y');
        var form = template.find('#' + template.data.FORM_ID);
        if (!form) return;

        form.elements.focuspoint_x_input.value = x;
        form.elements.focuspoint_y_input.value = y;

    });

    // Update the tagsInputStates when the tags change
    this.autorun(function() {
        var tags = AutoForm.getFieldValue('tags_input');
        if (tags) tags = tags.trim();

        template.tagsInputStates.set('tags', !!tags);
    });
});

Template.Partupsettings.onRendered(function() {
    var template = this;

    // this is a quick fix for
    // https://trello.com/c/IfsyNFgA/427-fe-partupsettings-is-not-rendered-with-correct-characters-remaining-messages-when-data-is-prefilled
    Meteor.setTimeout(function() {
        $(template.findAll('[data-max]')).each(function(index) {
            $(this).trigger('keyup');
        });
    }, 1000);

    var selectedNetworkId = undefined;
    if (template.data.networkSlug) {
        var network = Networks.findOne({slug: template.data.networkSlug});
        selectedNetworkId = network._id;
    } else {
        selectedNetworkId = template.data.currentPartup.network_id;
    }

    if (selectedNetworkId) {
        template.showNetworkDropdown.set(true);
        template.selectedPrivacyType.set('network');
        template.selectedPrivacyNetwork.set(selectedNetworkId);
        template.preselectedNetwork.set(selectedNetworkId);
    }

    // when editing an existing network part-up
    if (this.data.currentPartup) {
        var currentPartupNetworkId = this.data.currentPartup.network_id || false;
        var currentPartupPrivacyType = this.data.currentPartup.privacy_type;

        if (currentPartupNetworkId) {
            template.showNetworkDropdown.set(true);
            var privacyType = Partups.getPrivacyTypeByValue(currentPartupPrivacyType);
            // privacyLowerCaseValue
            var plcValue = privacyType.toLowerCase();
            if (plcValue === 'network_public' || plcValue === 'network_invite' || plcValue === 'network_closed') {
                plcValue = 'network';
            }
            template.selectedPrivacyType.set(plcValue);
            template.selectedPrivacyNetwork.set(currentPartupNetworkId);
            template.preselectedNetwork.set(currentPartupNetworkId);
        }
    }

    this.pluploadSettings = {
        buttons: {
            browse: '[data-browse-photos]'
        },
        dynamic_url: true,
        config: {
            multi_selection: false,
        },
        types: [
            { name: 'images', extensions: Partup.helpers.fileUploader.imageExtensions.join(',') }
        ],
        hooks: {
            FilesAdded(uploader, files) {
                template.loading.set('image-uploading', true);
                uploader.start();
            },
            FileUploaded(uploader, file, result) {
                if (!result) return;
                const response = JSON.parse(result.response);

                if (response.error) {
                    template.loading.set('image-uploading', false);
                    return Partup.client.notify.error(response.error);
                }
                if (!response.image) {
                    template.loading.set('image-uploading', false);
                    return Partup.client.notify.info('Something went wrong with uploading the image');
                }
                template.subscribe('images.one', response.image, {
                    onReady() {
                        template.loading.set('image-uploading', false);
                        template.imageSystem.currentImageId.set(response.image);
                        template.imageSystem.uploaded.set(true);
                        var focuspoint = template.imageSystem.focuspoint.get();
                        if (focuspoint) focuspoint.reset();
                    }
                });
            }
        }
    }
});

Template.Partupsettings.helpers({
    pluploadSettings() {
        return Template.instance().pluploadSettings;
    },
    datePicker: function() {
        return {
            input: 'data-bootstrap-datepicker',
            autoFormInput: 'data-autoform-input',
            prefillValueKey: 'end_date', // autoform key
            startDate: new Date()
        };
    },
    partup: function() {
        return this.currentPartup;
    },
    startPartupSchema: function() {
        return Partup.schemas.forms.partup;
    },
    formPlaceholders: function() {
        return formPlaceholders;
    },
    fieldsFromPartup: function() {
        var partup = this.currentPartup;
        if (!partup) return null;

        return Partup.transformers.partup.toFormStartPartup(partup);
    },
    nameCharactersLeft: function() {
        return Template.instance().nameCharactersLeft.get();
    },
    descriptionCharactersLeft: function() {
        return Template.instance().descriptionCharactersLeft.get();
    },
    partupImage: function() {
        return Template.instance().imageSystem;
    },
    partupImageId: function() {
        return Template.instance().imageSystem.currentImageId.get();
    },
    suggestionSetter: function() {
        return function(index) {
            Session.set('partials.create-partup.current-suggestion', index);
        };
    },
    currentSuggestion: function() {
        return Session.get('partials.create-partup.current-suggestion');
    },
    galleryIsLoading: function() {
        var template = Template.instance();
        return template.loading &&
            (template.loading.get('suggesting-images') ||
            template.loading.get('image-uploading') ||
            template.loading.get('setting-suggestion'));
    },
    imagepreviewIsLoading: function() {
        var template = Template.instance();
        return template.loading &&
            (template.loading.get('image-uploading') ||
             template.loading.get('setting-suggestion'));
    },
    uploadingPicture: function() {
        var template = Template.instance();
        return template.loading && template.loading.get('image-uploading');
    },
    setFocuspoint: function() {
        return Template.instance().setFocuspoint;
    },
    unsetFocuspoint: function() {
        return Template.instance().unsetFocuspoint;
    },
    focuspointView: function() {
        return {
            template: Template.instance(),
            selector: '[data-focuspoint-view]'
        };
    },
    onFocuspointUpdate: function() {
        return Template.instance().imageSystem.storeFocuspoint;
    },
    draggingFocuspoint: function() {
        return Template.instance().draggingFocuspoint.get();
    },
    selectedPrivacyLabel: function() {
        return Template.instance().selectedPrivacyLabel.get();
    },
    userNetworks: function() {
        return Networks.findForUser(Meteor.user(), Meteor.userId());
    },
    networkPrivacyTypes: function(network_id) {
        var network = Networks.findOne(network_id);
        var user = Meteor.user();
        var isAdmin = User(user).isAdminOfNetwork(network_id);
        var isColleague = User(user).isColleagueOfNetwork(network_id);
        var isColleagueCustomA = User(user).isColleagueCustomAOfNetwork(network_id);
        var isColleagueCustomB = User(user).isColleagueCustomBOfNetwork(network_id);
        var networkPrivacyType =
            Object.keys(Networks.privacy_types)
                .filter(function(type) {
                    return Networks.privacy_types[type] === network.privacy_type;
                });
        var privacyType = Partups.privacy_types[networkPrivacyType];
        var types = [{
            label: network.privacy_type_labels && network.privacy_type_labels[privacyType]
                ? TAPi18n.__('partupsettings-form-network-custom-privacy-label', {
                    name: network.privacy_type_labels[privacyType]})
                : TAPi18n.__('partupsettings-form-network-privacy-public'),
            value: 'network'
        }];
        var typeAdmin = {
            label: network.privacy_type_labels && network.privacy_type_labels[6]
                ? TAPi18n.__('partupsettings-form-network-custom-privacy-label-admins', {
                    name: network.privacy_type_labels[6]})
                : TAPi18n.__('partupsettings-form-network-privacy-admins'),
            value: 'network_admins'
        };
        var typeColleague = {
            label: network.privacy_type_labels && network.privacy_type_labels[7]
                ? TAPi18n.__('partupsettings-form-network-custom-privacy-label', {
                    name: network.privacy_type_labels[7]})
                : TAPi18n.__('partupsettings-form-network-privacy-colleagues'),
            value: 'network_colleagues'
        };
        var typeColleagueCustomA = {
            label: network.privacy_type_labels && network.privacy_type_labels[8]
                ? TAPi18n.__('partupsettings-form-network-custom-privacy-label', {
                    name: network.privacy_type_labels[8]})
                : TAPi18n.__('partupsettings-form-network-privacy-colleagues-custom-a'),
            value: 'network_colleagues_custom_a'
        };
        var typeColleagueCustomB = {
            label: network.privacy_type_labels && network.privacy_type_labels[9]
                ? TAPi18n.__('partupsettings-form-network-custom-privacy-label', {
                    name: network.privacy_type_labels[9]})
                : TAPi18n.__('partupsettings-form-network-privacy-colleagues-custom-b'),
            value: 'network_colleagues_custom_b'
        };

        // if user is Colleague custom B
        if (isColleagueCustomB) {
            if (network.customBRoleEnabled()) types.push(typeColleagueCustomB);
        // if user is Colleague custom A
        } else if (isColleagueCustomA) {
            if (network.customARoleEnabled()) types.push(typeColleagueCustomA);
            if (network.customBRoleEnabled()) types.push(typeColleagueCustomB);
        // if user is Colleague
        } else if (isColleague) {
            if (network.colleaguesRoleEnabled()) types.push(typeColleague);
            if (network.customARoleEnabled()) types.push(typeColleagueCustomA);
            if (network.customBRoleEnabled()) types.push(typeColleagueCustomB);
        // if user is Admin
        } else if (isAdmin) {
            types.push(typeAdmin);
            if (network.colleaguesRoleEnabled()) types.push(typeColleague);
            if (network.customARoleEnabled()) types.push(typeColleagueCustomA);
            if (network.customBRoleEnabled()) types.push(typeColleagueCustomB);
        }
        return types;
    },
    privacyTypes: function() {
        var types = [
            {
                label: 'partupsettings-form-privacy-public',
                value: 'public'
            },
            {
                label: 'partupsettings-form-privacy-private',
                value: 'private'
            }
        ];

        var networks = Networks.findForUser(Meteor.user(), Meteor.userId()).fetch();
        if (networks.length) {
            types.push({
                label: 'partupsettings-form-privacy-network',
                value: 'network'
            });
        }

        return types;
    },
    showNetworkDropdown: function() {
        return Template.instance().showNetworkDropdown.get() &&
            Networks.findForUser(Meteor.user(), Meteor.userId()).fetch().length;
    },
    phaseOptions: function() {
        return [
            {
                label: 'partupsettings-form-phase-brainstorm',
                value: Partups.PHASE.BRAINSTORM
            },
            {
                label: 'partupsettings-form-phase-plan',
                value: Partups.PHASE.PLAN
            },
            {
                label: 'partupsettings-form-phase-execute',
                value: Partups.PHASE.EXECUTE
            },
            {
                label: 'partupsettings-form-phase-grow',
                value: Partups.PHASE.GROW
            }
        ];
    },
    phaseChecked: function() {
        return this.value === Template.instance().selectedPhase.get();
    },
    selectedPhase: function() {
        return Template.instance().selectedPhase.get();
    },
    typeOptions: function() {
        return [
            {
                label: 'partupsettings-form-type-charity',
                value: Partups.TYPE.CHARITY
            },
            {
                label: 'partupsettings-form-type-enterprising',
                value: Partups.TYPE.ENTERPRISING
            },
            {
                label: 'partupsettings-form-type-commercial',
                value: Partups.TYPE.COMMERCIAL
            },
            {
                label: 'partupsettings-form-type-organization',
                value: Partups.TYPE.ORGANIZATION
            }
        ];
    },
    typeChecked: function() {
        return this.value === Template.instance().selectedType.get();
    },
    showCommercialBudget: function() {
        return this.value === Partups.TYPE.COMMERCIAL &&
            Template.instance().selectedType.get() == Partups.TYPE.COMMERCIAL;
    },
    showOrganizationBudget: function() {
        return this.value === Partups.TYPE.ORGANIZATION &&
            Template.instance().selectedType.get() == Partups.TYPE.ORGANIZATION;
    },
    selectedType: function() {
        return Template.instance().selectedType.get();
    },

    // Location autocomplete
    locationLabel: function() {
        return Partup.client.strings.locationToDescription;
    },
    locationFormvalue: function() {
        return function(location) {
            return location.id;
        };
    },
    locationQuery: function() {
        return function(query, sync, async) {
            Meteor.call('google.cities.autocomplete', query, function(error, locations) {
                lodash.each(locations, function(loc) {
                    loc.value = Partup.client.strings.locationToDescription(loc);
                });
                async(locations);
            });
        };
    },
    locationSelectionReactiveVar: function() {
        return Template.instance().selectedLocation;
    },
    locationHasValueVar: function() {
        return Template.instance().locationHasValueVar;
    },
    networkPreSelected: function() {
        var selectedNetworkId = Template.instance().data.networkSlug;
        return this._id === selectedNetworkId;
    },
    selectedPrivacyType: function() {
        return Template.instance().selectedPrivacyType.get();
    },
    selectedPrivacyNetwork: function() {
        return Template.instance().selectedPrivacyNetwork.get();
    },
    preselectedNetwork: function() {
        var network_id = Template.instance().preselectedNetwork.get();
        var network = Networks.findOne({_id: network_id});
        return network;
    },
    tagsInputIsEmpty: function() {
        var template = Template.instance();

        return !template.tagsInputStates.get('tags') && !template.tagsInputStates.get('input');
    },
    privacyChecked: function() {
        var selected = Template.instance().selectedPrivacyType.get();
        if (this.value === 'network') {
            if (this.value === selected) return true;
            return selected === 'network_admins';
        }
        return this.value === selected;
    },
    networkPrivacyChecked: function() {
        var selected = Template.instance().selectedPrivacyType.get();
        return this.value === selected;
    },
    currentCurrency: function() {
        return Template.instance().currentCurrency.get();
    },
});

Template.Partupsettings.events({
    'keyup [data-max]': function(event, template) {
        var $inputElement = $(event.currentTarget);
        var max = parseInt($inputElement.attr('maxlength'));
        var charactersLeftVar = $inputElement.data('characters-left-var');
        template[charactersLeftVar].set(max - $inputElement.val().length);
    },
    'click [data-imageremove]': function(event, template) {
        template.imageSystem.unsetUploadedPicture();
    },
    'change [data-type]': function(event, template) {
        var input = template.find('[data-type] label > :checked');
        if (!input) return;
        template.selectedType.set(input.value);
        setTimeout(function() {
            template.$('[name=type]').trigger('blur');
        });
    },
    'change [data-privacy-type]': function(event, template) {
        var input = template.find('[data-privacy-type] :checked');
        template.selectedPrivacyType.set(input.value);
        template.showNetworkDropdown.set(input.value === 'network');
        setTimeout(function() {
            template.$('[name=privacy_type_input]').trigger('blur');
        });
    },
    'change [data-privacy-network]': function(event, template) {
        template.selectedPrivacyNetwork.set(event.currentTarget.value);
        setTimeout(function() {
            template.$('[name=network_id]').trigger('blur');
        });
    },
    'change [data-partup-privacy-network]': function(event, template) {
        var input = template.find('[data-partup-privacy-network] :checked');
        template.selectedPrivacyType.set(input.value);
    },
    'click .pu-tooltip': function(event) {
        event.stopPropagation();
    },
    'click [data-focus-tagsinput]': function(event, template) {
        var target = event.currentTarget;

        var $parentElement = $(target.parentElement);
        if (!$parentElement) return;

        var input = $parentElement.find('.bootstrap-tagsinput input').get(0);
        if (!input) return;

        event.preventDefault();
        input.focus();
    },
    'keydown [data-tags-input] .bootstrap-tagsinput input, input [data-tags-input] .bootstrap-tagsinput input': function(event, template) {
        template.tagsInputStates.set('input', !!event.currentTarget.value.trim());
    },
    'change [data-phase]': function(event, template) {
        var input = template.find('[data-phase] :checked');
        template.selectedPhase.set(input.value);
        setTimeout(function() {
            template.$('[name=phase]').trigger('blur');
        });
    }
});

/*************************************************************/
/* Image system for Part-up cover picture */
/*************************************************************/
var ImageSystem = function(template) {
    var self = this;

    this.currentImageId = new ReactiveVar(false);
    this.uploaded = new ReactiveVar(false);
    this.focuspoint = new ReactiveDict();
    this.focuspoint.set('x', 0.5); // set default focuspoint position
    this.focuspoint.set('y', 0.5);

    this.unsetUploadedPicture = function() {
        self.currentImageId.set(false);
        self.uploaded.set(false);
    };

    this.storeFocuspoint = function(x, y) {
        if (typeof x === 'undefined') x = 0.5;
        if (typeof y === 'undefined') y = 0.5;
        self.focuspoint.set('x', x);
        self.focuspoint.set('y', y);
    };
};
