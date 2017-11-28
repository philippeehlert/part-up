// jscs:disable
/**
 * Render a single partup tile
 *
 * widget options:
 *
 * @param {Boolean} HIDE_TAGS       Whether the widget should hide the tags
 * @module client-partup-tile
 */
// jscs:enable

const MAX_AVATARS = 5;
const AVATAR_DEFAULT_RADIUS = 100;
const AVATAR_HOVERING_RADIUS = 125;
const AVATAR_DEFAULT_DISTANCE = 24;
const AVATAR_HOVERING_DISTANCE = 18;

const { getAvatarCoordinates } = Partup.client.partuptile;

Template.PartupTile.onCreated(function() {
    const template = this;

    // Transform partup
    const { partup, CONTEXT } = template.data;
    partup.hovering = new ReactiveVar(false);
    
    // -- Partup details
    partup.name = Partup.helpers.url.capitalizeFirstLetter(partup.name);
    partup.imageObject = partup.imageObject || Images.findOne({_id: partup.image});
    partup.boundedProgress = partup.progress ? Math.max(10, Math.min(99, partup.progress)) : 10;

    // -- Partup network
    partup.networkObject = partup.networkObject || Networks.findOne({_id: partup.network_id});
    if (partup.networkObject) {
        partup.networkObject.iconObject = partup.networkObject.iconObject || Images.findOne({_id: partup.networkObject.icon});
        
        // this checkd the network object en determines if the user is definitly a member of the network
        // this should not be considered the truth if it is false
        partup.networkObject.userIsDefinitlyMember = Partup.client.partuptile.userIsDefinitlyMemberOfNetwork(partup.networkObject, Meteor.userId());
    }
    
    const networkSlug = lodash.get(partup, 'networkObject.slug');


    // Partup tags
    partup.mappedTags = partup.tags.map((tag, index) => {
        if (CONTEXT === 'tribe') {
            return {
                tag,
                delay: .05 * index,
                networkSlug,
            };
        }
        return {
            tag,
            delay: .05 * index,
        };
    });

    // -- Partup counts
    partup.activityCount = partup.activity_count || Activities.findForPartup(partup).count();
    partup.supporterCount = partup.supporters ? partup.supporters.length : 0;
    partup.dayCount = Math.ceil(((((new Date() - new Date(partup.created_at)) / 1000) / 60) / 60) / 24);

    // -- Partup uppers
    partup.avatars = partup.uppers
        .slice(0, MAX_AVATARS)
        .map((avatar, index, arr) => {

            // Avatar position
            const default_coords = getAvatarCoordinates(arr.length, index, 0, AVATAR_DEFAULT_DISTANCE, AVATAR_DEFAULT_RADIUS);
            const hovering_coords = getAvatarCoordinates(arr.length, index, 0, AVATAR_HOVERING_DISTANCE, AVATAR_HOVERING_RADIUS);
            const position = {
                default: {
                    delay: .03 * index,
                    x: Math.round(default_coords.x + 95),
                    y: Math.round(default_coords.y + 95)
                },
                hover: {
                    delay: .03 * index,
                    x: Math.round(hovering_coords.x + 95),
                    y: Math.round(hovering_coords.y + 95)
                }
            };

            // Blue avatar, for example: (5+)
            if (partup.uppers.length > arr.length && index + 1 === MAX_AVATARS) {
                return {
                    position,
                    data: {
                        remainingUppers: partup.uppers.length - MAX_AVATARS + 1
                    }
                };
            }

            // Default avatar
            const uppers = lodash.get(partup, 'upperObjects');
            const upper = lodash.find(uppers, {_id: avatar}) || Meteor.users.findOne({_id: avatar});
            upper.avatarObject = lodash.get(upper, 'profile.imageObject', Images.findOne({_id: lodash.get(upper, 'profile.image')}));

            return {
                position,
                data: { upper },
            };
        });
});

Template.PartupTile.onRendered(function() {
    const template = this;

    // Bind tag positioner
    const tagsElement = template.find('.pu-sub-partup-tags');
    if (tagsElement) {
        template.autorun(() => {
            Partup.client.screen.size.get();
            const br = document.body.getBoundingClientRect();
            const rect = tagsElement.getBoundingClientRect();

            if (rect.right > br.right) {
                tagsElement.classList.add('pu-state-right');
            }
        });
    }

    const { partup } = template.data;
    // Focuspoint in discover image
    if (partup.image && !partup.archived_at) {
        const { imageObject: image = Images.findOne({_id: partup.image})} = partup;

        if (image && image.focuspoint) {
            const focuspointElm = template.find('[data-partup-tile-focuspoint]');
            template.focuspoint = new Focuspoint.View(focuspointElm, {
                x: image.focuspoint.x,
                y: image.focuspoint.y
            });
        }
    }

    const canvasElm = template.find('canvas.pu-sub-radial');
    if (canvasElm) Partup.client.partuptile.drawCircle(canvasElm);
});

Template.PartupTile.helpers({
    templateName: function() {
        return this.archived_at ? 'PartupTile_archived' : 'PartupTile_active';
    },
    showStartQuery: function() {
        return this.userIsDefinitlyMember ? (this.archived_at ? 'show=true' : 'show=false' ) : '';
    },
    adminsOnly: function(partup) {
        return partup.privacy_type === Partups.privacy_types.NETWORK_ADMINS;
    },
    colleaguesOnly: function(partup) {
        return partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES;
    },
    shortLabel: function(partup) {
        const privacyTypeLabels = partup.networkObject.privacy_type_labels;
        if (privacyTypeLabels && privacyTypeLabels[partup.privacy_type]) {
            if (partup.privacy_type === 6) {
                return privacyTypeLabels[partup.privacy_type];
            }
            return TAPi18n.__('partup-tile-label-custom-short', { name: privacyTypeLabels[partup.privacy_type]});
        }
        if (partup.privacy_type === Partups.privacy_types.NETWORK_ADMINS) return TAPi18n.__('partup-tile-label-admins-only-short');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES) return TAPi18n.__('partup-tile-label-colleagues-only-short');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A) return TAPi18n.__('partup-tile-label-colleagues-custom-a-only-short');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B) return TAPi18n.__('partup-tile-label-colleagues-custom-b-only-short');
        return undefined;
    },
    longLabel: function(partup) {
        const privacyTypeLabels = partup.networkObject.privacy_type_labels;
        if (privacyTypeLabels && privacyTypeLabels[partup.privacy_type]) {
            if (partup.privacy_type === 6) {
                return TAPi18n.__('partup-tile-label-admin-custom', { name: privacyTypeLabels[partup.privacy_type]});
            }
            return TAPi18n.__('partup-tile-label-custom', { name: privacyTypeLabels[partup.privacy_type]});
        }
        if (partup.privacy_type === Partups.privacy_types.NETWORK_ADMINS) return TAPi18n.__('partup-tile-label-admins-only');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES) return TAPi18n.__('partup-tile-label-colleagues-only');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A) return TAPi18n.__('partup-tile-label-colleagues-custom-a-only');
        if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B) return TAPi18n.__('partup-tile-label-colleagues-custom-b-only');
        return undefined;
    }
});

Template.PartupTile.events({
    'mouseenter .pu-partuptile': function(event, template) {
        template.data.partup.hovering.set(true);
    },
    'mouseleave .pu-partuptile': function(event, template) {
        template.data.partup.hovering.set(false);
    }
});
