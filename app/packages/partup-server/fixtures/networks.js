Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Networks.find().count()) {
      /* ING */
      /* 1 */
      Networks.insert({
        _id: 'nqBnE8nSLasaapXXS',
        sector_id: 'FhapMhLSOHcCCbPfO',
        name: 'ING (public)',
        slug: 'ing-public',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus veniam illo inventore excepturi architecto ut, numquam enim est assumenda ex doloremque quos ratione. Repellendus blanditiis, tempora fugit velit est deleniti.',
        image: 'T8pfWebTJmvbBNJ2g',
        icon: 'f7yzkqh9J9JvxCCqN',
        uppers: [
          'q63Kii9wwJX3Q6rHS', // Admin
        ],
        admins: ['q63Kii9wwJX3Q6rHS'],
        privacy_type: 1,
        created_at: new Date('2015-07-21T15:47:33.225Z'),
        updated_at: new Date('2015-07-21T15:47:33.225Z'),
        language: 'en',
        stats: {},
        chat_id: 'fMpNncPh4Qua6NANH',
      });

      /* 2 */
      Networks.insert({
        _id: 'kRCjWDBkKru3KfsjW',
        sector_id: 'FhapMhLSOHcCCbPfO',
        name: 'ING (invite)',
        slug: 'ing-invite',
        privacy_type: 2,
        image: 'efDuvuTzpqH65P9DF',
        icon: 'fReGXG4qkNXb4K8wp',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi architecto consequatur unde dolorem fuga laboriosam non alias blanditiis odit vero!',
        uppers: [
          'q63Kii9wwJX3Q6rHS', // Admin
          'K5c5M4Pbdg3B82wQH', // Default
        ],
        admins: ['q63Kii9wwJX3Q6rHS'],
        created_at: new Date('2015-07-21T15:51:48.825Z'),
        updated_at: new Date('2015-07-21T15:51:48.825Z'),
        invites: [
          {
            _id: 'a7qcp5RHnh5rfaeW9',
            invited_at: new Date('2015-07-22T09:11:08.062Z'),
            invited_by_id: 'K5c5M4Pbdg3B82wQH',
          },
        ],
        stats: {},
        chat_id: 'JSGpNRF5R3gjEWcGf',
      });

      /* 3 */
      Networks.insert({
        _id: 'wfCv4ZdPe5WNT4xfg',
        sector_id: 'FhapMhLSOHcCCbPfO',
        name: 'ING (closed)',
        slug: 'ing-closed',
        privacy_type: 3,
        image: 'PnYAg3EX5dKfEnkdn',
        icon: '4rymNTA3jFfTRKtFJ',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo nesciunt tempora accusamus temporibus ipsam modi.',
        uppers: [
          'q63Kii9wwJX3Q6rHS', // Admin
          'K5c5M4Pbdg3B82wQI', // John
        ],
        admins: ['q63Kii9wwJX3Q6rHS'],
        created_at: new Date('2015-07-21T15:51:56.562Z'),
        updated_at: new Date('2015-07-21T15:51:56.562Z'),
        invites: [
          {
            _id: 'K5c5M4Pbdg3B82wQI',
            invited_at: new Date('2015-07-22T09:12:46.307Z'),
            invited_by_id: 'q63Kii9wwJX3Q6rHS',
          },
          {
            _id: 'a7qcp5RHnh5rfaeW9', // Judy
            invited_at: new Date('2015-07-22T09:31:48.358Z'),
            invited_by_id: 'q63Kii9wwJX3Q6rHS', // Admin
          },
        ],
        pending_uppers: [
          'a7qcp5RHnh5rfaeW9', // Judy
        ],
        stats: {},
        chat_id: '9nTogbMy6Ddjfh6NP',
      });

      /* Lifely */
      /* 4 */
      Networks.insert({
        _id: 'ibn27M3ePaXhmKzWq',
        sector_id: 'xPqmVC0HXZSonoTXB',
        name: 'Lifely (open)',
        slug: 'lifely-open',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, delectus.',
        language: 'nl',
        privacy_type: 1,
        image: 'raaNx9aqA6okiqaS4',
        icon: 'SEswZsYiTTKTTdnN5',
        uppers: [
          'q63Kii9wwJX3Q6rHS', // Admin
          'K5c5M4Pbdg3B82wQH', // Default
          'a7qcp5RHnh5rfaeW9', // Judy
        ],
        admins: ['q63Kii9wwJX3Q6rHS'], // Admin
        created_at: new Date('2015-07-21T15:52:04.548Z'),
        updated_at: new Date('2015-07-21T15:52:04.548Z'),
        stats: {},
        chat_id: 'wioZDD9bTkT2eDF4c',
      });

      Networks.insert({
        _id: 'bmAGcqxmb6izfgXLK',
        name: 'The Archived Tribe',
        slug: 'the-archived-tribe',
        sector_id: '',
        privacy_type: 1,
        image: 'raaNx9aqA6okiqaS4',
        icon: 'SEswZsYiTTKTTdnN5',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, delectus.',
        tags: ['archives'],
        uppers: [
          'q63Kii9wwJX3Q6rHS', // Admin
          'K5c5M4Pbdg3B82wQH', // Default
        ],
        upper_count: 2,
        admins: ['q63Kii9wwJX3Q6rHS'],
        created_at: new Date('2015-07-21T15:52:04.548Z'),
        updated_at: new Date('2015-07-21T15:52:04.548Z'),
        archived_at: new Date(),
        language: 'nl',
        stats: {},
        location: {
          lat: 52.0704978,
          country: 'Netherlands',
          lng: 4.300699899999999,
          place_id: 'ChIJcb2YQi-3xUcREGwejVreAAQ',
          city: 'The Hague',
        },
        chat_id: 'AZvyQ3qiSGjuuW5Am',
      });

      // Networks.insert({
      //     '_id' : '',
      //     'name' : '',
      //     'slug' : '',
      //     'sector_id' : '',
      //     'privacy_type' : 1,
      //     'image': 'raaNx9aqA6okiqaS4',
      //     'icon': 'SEswZsYiTTKTTdnN5',
      //     'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, delectus.',
      //     'tags' : [
      //         '',
      //         '',
      //         ''
      //     ],
      //     'uppers' : [
      //         '',
      //         ''
      //     ],
      //     'upper_count' : 2,
      //     'admins' : [''],
      //     'created_at' : new Date(),
      //     'updated_at' : new Date(),
      //     'language': 'nl',
      //     'stats': {},
      //     'location': {
      //         'lat': 52.0704978,
      //         'country': 'Netherlands',
      //         'lng': 4.300699899999999,
      //         'place_id': 'ChIJcb2YQi-3xUcREGwejVreAAQ',
      //         'city': 'The Hague'
      //     },
      //     'chat_id': ''
      // });
    }
  }
});
