Partup.client.network = {
  displayTags: function(network) {
    if (!network) {
      throw new Error(
        'Please provide a network object if it is not an instance of Network'
      );
    }

    let slug = network.slug;
    let maxTags = 5;
    let tags = [];
    let commonTags = network.common_tags || [];
    let customTags = network.tags || [];

    _.times(maxTags, function(index) {
      let tag = commonTags[index];
      if (!tag) return;
      tags.push({
        tag: tag.tag,
        networkSlug: slug || '',
      });
    });

    if (tags.length === maxTags) return tags;

    _.times(maxTags - tags.length, function(index) {
      let tag = customTags[index];
      if (!tag) return;
      tags.push({
        tag: tag,
        networkSlug: slug || '',
      });
    });

    return tags;
  },
};
