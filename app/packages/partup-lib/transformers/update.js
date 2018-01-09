/**
 @namespace Update transformer service
 @name partup.transformers.update
 @memberof Partup.transformers
 */
Partup.transformers.update = {
    /**
     * Transform form to new message
     *
     * @memberof Partup.transformers.update
     * @param {mixed[]} fields
     * @param {object} upper
     * @param {string} partupId
     */
    fromFormNewMessage: function(fields, upper, partupId) {
        let hasUrl = fields.text.match(
            /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        );
        hasUrl = hasUrl && hasUrl.length > 0 ? true : false;
        let hasDocuments =
            (fields.documents && fields.documents.length > 0) ||
            (fields.files && fields.files.length > 0)
                ? true
                : false;

        return {
            partup_id: partupId,
            type_data: {
                new_value: fields.text,
                images: fields.images,
                documents: fields.documents,
                files: fields.files,
            },
            comments_count: 0,
            upper_id: upper._id,
            has_documents: hasDocuments,
            has_links: hasUrl,
            created_at: new Date(),
            updated_at: new Date(),
        };
    },
};
