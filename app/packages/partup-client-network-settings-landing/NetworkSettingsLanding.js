Template.NetworkSettingsLanding.onCreated(function() {
    const userId = Meteor.userId();
    const { networkSlug: slug } = this.data;

    this.editingBlocks = new ReactiveVar([]);
    this.whyCharacterCount = new ReactiveVar(0);
    this.chatCharacterCount = new ReactiveVar(0);
    this.aboutCharacterCount = new ReactiveVar(0);
    this.submitting = new ReactiveVar(false);

    this.subscribe('networks.one', slug, {
        onReady: () => {
            var network = Networks.findOne({slug});
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });
});

Template.NetworkSettingsLanding.helpers({
    form(...args) {
        const template = Template.instance();
        const { networkSlug: slug } = this;
        const network = Networks.findOne({slug});
        const { name, content: { why_body, chat_body, about_body, ...restContent } = {} } = network || {};

        return {
            schema: () => Partup.schemas.forms.networkContent,
            doc: () => ({
                why_body,
                about_body,
                chat_body,
                ...restContent,
            }),
            whyBodyInput: {
                input: 'data-why-body',
                className: 'pu-textarea pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-why-body-placeholder', {tribename: name}),
                prefill: why_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.why_body.max,
                characterCountVar: template.whyCharacterCount
            },
            chatBodyInput: {
                input: 'data-chat-body',
                className: 'pu-textarea pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-chat-body-placeholder', {tribename: name}),
                prefill: chat_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.chat_body.max,
                characterCountVar: template.chatCharacterCount
            },
            aboutBodyInput: {
                input: 'data-about-body',
                className: 'pu-textarea pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-about-body-placeholder', {tribename: name}),
                prefill: about_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.about_body.max,
                characterCountVar: template.aboutCharacterCount
            },
        };
    },
    state(...args) {
        const template = Template.instance();
        return {
            whyCharacterCount: () => template.whyCharacterCount.get(),
            chatCharacterCount: () => template.chatCharacterCount.get(),
            aboutCharacterCount: () => template.aboutCharacterCount.get(),
        };
    },
    placeholders(...args) {
        const { networkSlug: slug } = this;
        const { name } = Networks.findOne({slug});
        return {
            video_url: () => TAPi18n.__('network-settings-landing-form-video-url-placeholder'),
            why_title: () => TAPi18n.__('network-settings-landing-form-why-title-placeholder', {tribename: name}),
            chat_title: () => TAPi18n.__('network-settings-landing-form-chat-title-placeholder'),
            chat_subtitle: () => TAPi18n.__('network-settings-landing-form-chat-subtitle-placeholder'),
            about_title: () => TAPi18n.__('network-settings-landing-form-about-title-placeholder', {tribename: name}),
        };
    }
});

AutoForm.addHooks('networkEditLandingForm', {
    onSubmit: function(doc) {
        const template = this.template.parent();
        const { networkSlug: slug } = template.data;

        template.submitting.set(true);

        Meteor.call('networks.update_content', slug, doc, (err) => {
            template.submitting.set(false);

            if (err && err.message) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(TAPi18n.__('network-settings-form-saved'));
            this.done();
        });

        return false;
    }
});
