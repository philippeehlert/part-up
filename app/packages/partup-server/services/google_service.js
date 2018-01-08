let d = Debug('services:google');

/**
 @namespace Partup server google service
 @name Partup.server.services.google
 @memberof Partup.server.services
 */
Partup.server.services.google = {
  searchCities: function(query) {
    let key = process.env.GOOGLE_API_KEY;
    let placesAutocomplete = PlacesAutocompletes.findOne({ query: query });

    if (placesAutocomplete) {
      d('Autocompleted cities for [' + query + '] from Cache');
      return placesAutocomplete.places;
    }

    // For more details: https://developers.google.com/places/webservice/autocomplete
    let response = HTTP.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' +
        key +
        '&input=' +
        encodeURIComponent(query) +
        '&types=(cities)'
    );

    if (response.statusCode !== 200) {
      Log.error(
        'Google places api returned with a [' + response.statusCode + ']',
        response
      );
      return [];
    }

    let data = get(response, 'data.predictions');

    if (!data) return [];

    PlacesAutocompletes.insert({
      query: query,
      created_at: new Date(),
      places: data,
    });

    d('Autocompleted cities for [' + query + '] from Google');

    return data;
  },

  getCity: function(googlePlaceId) {
    let key = process.env.GOOGLE_API_KEY;
    let place = Places.findOne({ place_id: googlePlaceId });

    if (place) {
      d('Loaded city with placeId [' + googlePlaceId + '] from Cache');
      return place;
    }

    // For more details: https://developers.google.com/places/webservice/details
    let response = HTTP.get(
      'https://maps.googleapis.com/maps/api/place/details/json?key=' +
        key +
        '&placeid=' +
        googlePlaceId
    );

    if (response.statusCode !== 200) {
      Log.error(
        'Google places api returned with a [' + response.statusCode + ']',
        response
      );
      return false;
    }

    let data = mout.object.get(response, 'data.result');

    if (!data) return false;

    data.place_id = googlePlaceId;
    data.created_at = new Date();

    d('Loaded city with placeId [' + googlePlaceId + '] from Google');

    // Insert new location
    Places.insert(data);

    // Return the retrieved data object
    return data;
  },

  detectLanguage: function(query) {
    let defaultValue = 'en';
    if (!query) return defaultValue;

    let key = process.env.GOOGLE_API_KEY;

    try {
      // For more details: https://cloud.google.com/translate/v2/using_rest?hl=en#detect-language
      var response = HTTP.get(
        'https://www.googleapis.com/language/translate/v2/detect?key=' +
          key +
          '&q=' +
          query
      );
    } catch (error) {
      Log.error('Error while detecting language: ' + error);
      return defaultValue;
    }

    if (response.statusCode !== 200) {
      return defaultValue;
    }

    if (response.error) return defaultValue;
    if (response.data.error) return defaultValue;

    let data = mout.object.get(response, 'data.data.detections')[0][0];
    let language = data.language;

    if (!language) return defaultValue;

    d('Detected language for [' + query + '] ("' + language + '") from Google');

    return language;
  },
};
