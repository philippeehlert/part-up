Meteor.methods({
  /**
   * Insert a new sector
   *
   * @param {string} fields
   */
  'sectors.insert': function(fields) {
    check(fields, Partup.schemas.forms.sector);

    this.unblock();

    // Check if user is admin
    let user = Meteor.user();
    if (!User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');

    try {
      if (!Sectors.findOne({ name: fields.name })) {
        Sectors.insert({
          name: fields.name,
          phrase_key: fields.phrase_key,
        });
      } else {
        throw new Meteor.Error('sector_already_exists');
      }

      return true;
    } catch (error) {
      Log.error(error);
      if (error.message == '[sector_already_exists]') {
        throw new Meteor.Error(400, 'sector_already_exists');
      }
      throw new Meteor.Error(400, 'sector_could_not_be_inserted');
    }
  },

  /**
   * Remove a sector
   *
   * @param {String} sectorId
   */
  'sectors.remove': function(sectorId) {
    check(sectorId, String);

    let user = Meteor.user();
    if (!User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');

    try {
      Networks.update({ sector_id: sectorId }, { $unset: { sector_id: '' } });
      Sectors.remove({ _id: sectorId });
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'sector_could_not_be_removed');
    }
  },

  /**
   * Update an existing sector
   * @name sectors.update
   * @param {String} sectorId
   * @param {Mixed[]} fields
   */
  'sectors.update': function(sectorId, fields) {
    check(sectorId, String);
    check(fields, Partup.schemas.forms.sector);

    if (!User(Meteor.user()).isAdmin()) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      let sector = Sectors.findOneOrFail({ _id: sectorId });
      Sectors.update(sector._id, { $set: fields });
    } catch (error) {
      if (error.reason.search(/could_not_be_found/) !== -1) {
        throw error;
      }
      Log.error(error);
      throw new Meteor.Error(400, 'sector_could_not_be_updated');
    }
  },
});
