var tagsConfiguration = {
    tagClass: 'pu-tag pu-tag-disableglobalclick',
    maxTags: 5
};
/**
 * Base Network schema
 * @name networkBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var networkBaseSchema = new SimpleSchema({
    background_image: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        max: 350,
        optional: true
    },
    icon: {
        type: String,
        optional: true
    },
    image: {
        type: String,
        optional: true
    },
    name: {
        type: String,
        max: 150
    },
    website: {
        type: String,
        max: 255,
        optional: true,
        regEx: Partup.services.validators.simpleSchemaUrlWithoutProtocol
    }
});

/**
 * Network entity schema
 * @name network
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.network = new SimpleSchema([networkBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    admins: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id
    },
    chat_id: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    colleagues: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    colleagues_custom_a: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    colleagues_custom_b: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    common_tags: {
        type: Object,
        optional: true
    },
    contentblocks: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    invites: {
        type: [Object],
        optional: true
    },
    location: {
        type: Object,
        optional: true
    },
    partups: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    pending_uppers: {
        type: [Object],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    'pending_uppers._id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'pending_uppers.invited_at': {
        type: Date,
        defaultValue: new Date()
    },
    'pending_uppers.invited_by_id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    sector: {
        type: String,
        optional: true
    },
    stats: {
        type: Object
    },
    'stats.activity_count': {
        type: Number,
        min: 0
    },
    'stats.partner_count': {
        type: Number,
        min: 0
    },
    'stats.partup_count': {
        type: Number,
        min: 0
    },
    'stats.supporter_count': {
        type: Number,
        min: 0
    },
    'stats.upper_count': {
        type: Number,
        min: 0
    },
    swarms: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    tags: {
        type: [String],
        minCount: 1
    },
    'tags.$': {
        max: 30
    },
    updated_at: {
        type: Date,
        defaultValue: new Date()
    },
    uppers: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    }
}]);

/**
 * network form schema
 * @name network
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.network = new SimpleSchema([networkBaseSchema, {
    location_input: {
        type: String,
        max: 255
    },
    tags_input: {
        type: String,
        regEx: Partup.services.validators.tagsSeparatedByComma,
        custom: function() {
            var max = false;
            lodash.each(this.value.split(','), function(tag) {
                if (tag.length > 30) max = true;
            });

            if (max) return 'individualMaxString';
        },
        autoform: {
            type: 'tags',
            afFieldInput: tagsConfiguration
        }
    },
    sector: {
        type: String,
        optional: true
    }
}]);

/**
 * network create form schema
 * @name networkCreate
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.networkCreate = new SimpleSchema([networkBaseSchema, {
    privacy_type: {
        type: Number,
        min: 1,
        max: 3
    }
}]);

/**
 * network create form schema
 * @name networkEdit
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.networkEdit = new SimpleSchema({
    admins: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id
    }
});

/**
 * network content form schema
 * @name networkContent
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.networkContent = new SimpleSchema({
    video_url: {
        type: String,
        max: 255
    },
    why_title: {
        type: String,
        max: 255
    },
    why_body: {
        type: String,
        max: 999
    },
    about_title: {
        type: String,
        max: 255
    },
    about_body: {
        type: String,
        max: 999
    }
});
