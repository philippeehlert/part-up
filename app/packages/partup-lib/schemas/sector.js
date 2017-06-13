/**
 * Base Sector schema
 * @name sectorBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var sectorBaseSchema = new SimpleSchema({
});

/**
 * Sector entity schema
 * @name sector
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.sector = new SimpleSchema([sectorBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    }
}]);

/**
 * sector form schema
 * @name sector
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.sector = new SimpleSchema([sectorBaseSchema, {
    /**
     * The name of which the sector can be identified with, therefore it should always be unique
     * @name name
     * @member {String}
     */
    name: {
        type: String,
        max:150
    },
    /**
     * The phraseapp key that shows a localized name to the user
     * @name phrase_key
     * @member {String}
     */
    phrase_key: {
        type: String
    }
}]);
