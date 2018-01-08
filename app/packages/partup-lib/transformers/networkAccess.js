/**
 @namespace Network access transformer service
 @name partup.transformers.networkAccess
 @memberof Partup.transformers
 */

Partup.transformers.networkAccess = {
  /**
   * Transform network to admin network access form
   *
   * @memberof Partup.transformers.networkAccess
   * @param {object} network
   */
  toFormNetworkAccess: function(network) {
    return {
      create_partup_restricted: network.create_partup_restricted,
      colleagues_default_enabled: network.colleagues_default_enabled,
      colleagues_custom_a_enabled: network.colleagues_custom_a_enabled,
      colleagues_custom_b_enabled: network.colleagues_custom_b_enabled,
      label_admins: network.privacy_type_labels
        ? network.privacy_type_labels[6]
        : '',
      label_colleagues: network.privacy_type_labels
        ? network.privacy_type_labels[7]
        : '',
      label_colleagues_custom_a: network.privacy_type_labels
        ? network.privacy_type_labels[8]
        : '',
      label_colleagues_custom_b: network.privacy_type_labels
        ? network.privacy_type_labels[9]
        : '',
    };
  },

  /**
   * Transform network access form to network
   *
   * @memberof Partup.transformers.networkAccess
   * @param {mixed[]} fields
   */
  fromFormNetworkAccess: function(fields) {
    let network = {
      create_partup_restricted: fields.create_partup_restricted,
      privacy_type_labels: {
        '6': fields.label_admins,
        '7': fields.label_colleagues,
        '8': fields.label_colleagues_custom_a,
        '9': fields.label_colleagues_custom_b,
      },
    };

    if (_.isBoolean(fields.colleagues_default_enabled)) {
      network.colleagues_default_enabled = fields.colleagues_default_enabled;
      // clean up the user 'access levels'
      if (fields.colleagues_default_enabled === false) {
        network.colleagues = [];
      }
    }

    if (_.isBoolean(fields.colleagues_custom_a_enabled)) {
      network.colleagues_custom_a_enabled = fields.colleagues_custom_a_enabled;
      // clean up the user 'access levels'
      if (fields.colleagues_custom_a_enabled === false) {
        network.colleagues_custom_a = [];
      }
    }

    if (_.isBoolean(fields.colleagues_custom_b_enabled)) {
      network.colleagues_custom_b_enabled = fields.colleagues_custom_b_enabled;
      // clean up the user 'access levels'
      if (fields.colleagues_custom_b_enabled === false) {
        network.colleagues_custom_b = [];
      }
    }

    return network;
  },
};
