/**
 * ContentBlock form schema
 * @name contentBlock
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.contentBlock = new SimpleSchema({
    title: {
        type: String,
        optional: true
    },
    text: {
        type: String,
        max: 2000,
        optional: true,
    },
    image: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    type: {
        type: String,
        allowedValues: ['intro', 'paragraph']
    }
});
