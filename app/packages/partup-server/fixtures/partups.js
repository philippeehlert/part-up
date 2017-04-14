Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Partups.find().count()) {

            /* ING */
            /* 1) Crowdfunding */
            Partups.insert({
                '_id' : 'gJngF65ZWyS9f3NDE',
                'network_id' : 'nqBnE8nSLasaapXXS',
                'name' : 'Crowd funding Part-up organiseren',
                'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE',
                'description' : 'Crowd funding campagne lanceren voor marketing en financiering app development.',
                'language' : 'nl',
                'type' : Partups.TYPE.COMMERCIAL,
                'privacy_type' : 3,
                'currency' : null,
                'type_commercial_budget' : 1000,
                'type_organization_budget' : null,
                'creator_id' : 'K5c5M4Pbdg3B82wQH',
                'created_at' : new Date('2015-07-21T14:03:19.964Z'),
                'end_date' : new Date('2016-11-30T00:00:00.000Z'),
                'phase': null,
                'progress' : 0,
                'board_id' : 'VItDJ3O3MpzeiPU5J',
                'board_view' : false,
                'activity_count' : 2,
                'image' : 'FTHbg6wbPxjiA4Y8w',
                'tags' : [
                    'crowdfunding',
                    'marketing',
                    'part-up',
                    'geld'
                ],
                'location' : {
                    'city' : 'Amsterdam',
                    'lat' : 52.3702157000000028,
                    'lng' : 4.8951679000000006,
                    'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'K5c5M4Pbdg3B82wQH',
                    'K5c5M4Pbdg3B82wQI'
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'supporters' : [
                    'a7qcp5RHnh5rfaeW9'
                ],
                'upper_data' : [
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQH',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQI',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'a7qcp5RHnh5rfaeW9',
                        'new_updates' : []
                    }
                ]
            });

            /* 2 Semi Secret */
            Partups.insert({
                '_id' : 'ASfRYBAzo2ayYk5si',
                'network_id' : 'kRCjWDBkKru3KfsjW',
                'name' : 'A semisecret ING partup, plus ones are ok',
                'slug' : 'a-semisecret-ing-partup-plus-ones-are-ok-ASfRYBAzo2ayYk5si',
                'description' : 'semi secret organized stuff',
                'language' : 'en',
                'type' : Partups.TYPE.ENTERPRISING,
                'privacy_type' : 4,
                'currency' : null,
                'type_commercial_budget' : null,
                'type_organization_budget' : null,
                'creator_id' : 'K5c5M4Pbdg3B82wQH',
                'created_at' : new Date('2015-07-22T09:38:22.609Z'),
                'end_date' : new Date('2017-01-31T00:00:00.000Z'),
                'phase' : null,
                'progress' : 0,
                'board_id' : 'jMU371tasWnf0RYUh',
                'board_view' : true,
                'image' : 'ComeF2exAjeKBPAf8',
                'tags' : [
                    'ing',
                    'organizational'
                ],
                'location' : {
                    'city' : 'Amsterdam',
                    'lat' : 52.3702157000000028,
                    'lng' : 4.8951679000000006,
                    'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'q63Kii9wwJX3Q6rHS', //Admin
                    'K5c5M4Pbdg3B82wQH'  //Default
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'upper_data' : [
                    {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQH',
                        'new_updates' : []
                    }
                ]
            });

            /* 2) Super secret */
            Partups.insert({
                '_id' : 'CJETReuE6uo2eF7eW',
                'network_id' : 'wfCv4ZdPe5WNT4xfg',
                'name' : 'Super secret closed ING partup',
                'slug' : 'super-secret-closed-ing-partup-CJETReuE6uo2eF7eW',
                'description' : 'secret stuff',
                'language' : 'en',
                'type' : Partups.TYPE.CHARITY,
                'privacy_type' : 5,
                'currency' : null,
                'type_commercial_budget' : null,
                'type_organization_budget' : null,
                'creator_id' : 'K5c5M4Pbdg3B82wQI',
                'created_at' : new Date('2015-07-22T09:26:51.361Z'),
                'end_date' : new Date('2017-03-31T00:00:00.000Z'),
                'phase' : null,
                'progress' : 0,
                'board_id' : 'sGrp9AkRSDVwXNZnn',
                'board_view' : true,
                'image' : 'D3zGxajTjWCLhXokS',
                'tags' : [
                    'ing',
                    'financial'
                ],
                'location' : {
                    'city' : 'Amsterdam',
                    'lat' : 52.3702157000000028,
                    'lng' : 4.8951679000000006,
                    'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'K5c5M4Pbdg3B82wQI'
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'upper_data' : [
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQI',
                        'new_updates' : []
                    }
                ]
            });
            

            /* 5 */
            // Partups.insert({
            //     '_id' : 'WxrpPuJkhafJB3gfF',
            //     'network_id' : 'ibn27M3ePaXhmKzWq',
            //     'name' : 'Partup Premium Part-up',
            //     'description' : 'private',
            //     'type' : Partups.TYPE.ORGANIZATION,
            //     'type_organization_budget' : 130,
            //     'end_date' : new Date('2017-05-31T00:00:00.000Z'),
            //     'image' : 'xfYreAouRFh4mnctk',
            //     'tags' : [
            //         'private'
            //     ],
            //     'location' : {
            //         'city' : 'Amsterdam',
            //         'lat' : 52.3702157000000028,
            //         'lng' : 4.8951679000000006,
            //         'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
            //         'country' : 'Netherlands'
            //     },
            //     'privacy_type' : 3,
            //     'uppers' : [
            //         'K5c5M4Pbdg3B82wQH'
            //     ],
            //     'creator_id' : 'K5c5M4Pbdg3B82wQH',
            //     'created_at' : new Date('2015-07-28T15:26:34.086Z'),
            //     'slug' : 'partup-premium-part-up-WxrpPuJkhafJB3gfF',
            //     'analytics' : {
            //         'clicks_total' : 1,
            //         'clicks_per_day' : 1,
            //         'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            //         'last_ip' : '127.0.0.1'
            //     },
            //     'language' : 'en',
            //     'upper_data' : [
            //         {
            //             '_id' : 'K5c5M4Pbdg3B82wQH',
            //             'new_updates' : []
            //         }
            //     ]
            // });

            /* Lifely (open) */

            /* 1 Orgnize meteor meetup - public */
            Partups.insert({
                '_id' : 'vGaxNojSerdizDPjb',
                'network_id' : 'ibn27M3ePaXhmKzWq',
                'name' : 'Organise a Meteor Meetup',
                'slug' : 'organise-a-meteor-meetup-vGaxNojSerdizDPjb',
                'description' : 'organise a meetup at lifely',
                'language' : 'en',
                'type' : Partups.TYPE.CHARITY,
                'privacy_type' : 3,
                'currency' : null,
                'type_commercial_budget' : null,
                'type_organization_budget' : null,
                'creator_id' : 'a7qcp5RHnh5rfaeW9',
                'created_at' : new Date('2015-07-22T09:42:13.878Z'),
                'end_date' : new Date('2017-01-31T00:00:00.000Z'),
                'phase' : null,
                'progress' : 0,
                'board_id' : '9TEcgO45TkVBizotA',
                'board_view' : false,
                'image' : 'J2KxajXMcqiKwrEBu',
                'tags' : [
                    'lifely',
                    'meetup',
                    'meteor'
                ],
                'location' : {
                    'city' : 'Utrecht',
                    'lat' : 52.0907373999999876,
                    'lng' : 5.1214200999999999,
                    'place_id' : 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'a7qcp5RHnh5rfaeW9'
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'upper_data' : [
                    {
                        '_id' : 'a7qcp5RHnh5rfaeW9',
                        'new_updates' : []
                    }
                ]
            });

            /* 2 :: Incubator - public, lanes */
            Partups.insert({
                '_id' : 'vGaxNojSerdizDPjc',
                'network_id' : 'ibn27M3ePaXhmKzWq',
                'name' : 'Incubator (list)',
                'slug' : 'incubator-vGaxNojSerdizDPjbc',
                'description' : 'Bring all your idea\'s here',
                'language' : 'en',
                'type' : Partups.TYPE.CHARITY,
                'privacy_type' : 3,
                'currency' : null,
                'type_commercial_budget' : null,
                'type_organization_budget' : null,
                'creator_id' : 'K5c5M4Pbdg3B82wQH',
                'created_at' : new Date('2015-07-28T15:26:34.086Z'),
                'end_date' : new Date('2020-05-31T00:00:00.000Z'),
                'phase' : null,
                'progress' : 0,
                'board_id' : 'Gzmun04TtYiP8llQ1',
                'board_view' : false,
                'image' : 'xfYreAouRFh4mnctk',
                'tags' : [
                    'public',
                    'ideas'
                ],
                'location' : {
                    'city' : 'Amsterdam',
                    'lat' : 52.3702157000000028,
                    'lng' : 4.8951679000000006,
                    'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'K5c5M4Pbdg3B82wQH', //Default - creator
                    'K5c5M4Pbdg3B82wQI', //John
                    'q63Kii9wwJX3Q6rHS'  //Admin
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'upper_data' : [
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQH',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQI',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'new_updates' : []
                    }
                ]
            });

            /* 3 :: Partup Dev - Public, board */
            Partups.insert({
                '_id' : 'vGaxNojSerdizDPjd',
                'network_id' : 'ibn27M3ePaXhmKzWq',
                'name' : 'Part-up developement (board)',
                'slug' : 'part-up-developement-vGaxNojSerdizDPjd',
                'description' : 'Developement of the Part-up platform',
                'language' : 'en',
                'type' : Partups.TYPE.CHARITY,
                'privacy_type' : 3,
                'currency' : null,
                'type_commercial_budget' : null,
                'type_organization_budget' : null,
                'creator_id' : 'K5c5M4Pbdg3B82wQI',
                'created_at' : new Date('2015-07-28T15:26:34.086Z'),
                'end_date' : new Date('2020-05-31T00:00:00.000Z'),
                'phase' : null,
                'progress' : 0,
                'board_id' : 'vGaxNojSerdizDPj0',
                'board_view' : true,
                'image' : 'xfYreAouRFh4mnctk',
                'tags' : [
                    'invite',
                    'developement'
                ],
                'location' : {
                    'city' : 'Amsterdam',
                    'lat' : 52.3702157000000028,
                    'lng' : 4.8951679000000006,
                    'place_id' : 'ChIJVXealLU_xkcRja_At0z9AGY',
                    'country' : 'Netherlands'
                },
                'uppers' : [
                    'q63Kii9wwJX3Q6rHS', //Admin
                    'K5c5M4Pbdg3B82wQH', //Default
                    'a7qcp5RHnh5rfaeW9'  //Judy
                ],
                'analytics' : {
                    'clicks_total' : 1,
                    'clicks_per_day' : 1,
                    'clicks_per_hour' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    'last_ip' : '127.0.0.1'
                },
                'upper_data' : [
                    {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'K5c5M4Pbdg3B82wQH',
                        'new_updates' : []
                    },
                    {
                        '_id' : 'a7qcp5RHnh5rfaeW9',
                        'new_updates' : []
                    }
                ]
            });

            /* 6-36 */
            /*
            for (var i = 0; i < 30; i++) {
               var descriptions = [
                   'This describes just how great this Part-up is, so please join and let\'s make it the best part-up on the web.',
                   'This describes just how great this Part-up is.',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima error veritatis ratione dolor perferendis inventore optio. Error omnis nostrum expedita.',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum repudiandae exercitationem unde sunt voluptatum consequatur at ipsum incidunt praesentium. Lorem ipsum dolor sit amet.'
               ];

               Partups.insert({
                   name: Fake.fromArray([Fake.sentence(2), Fake.sentence(3), Fake.sentence(4), Fake.sentence(5)]).replace('.', ''),
                   description: Fake.paragraph(Fake.fromArray([1, 2, 3, 4])),
                   creator_id: 'K5c5M4Pbdg3B82wQH',
                   tags: Fake.fromArray([[Fake.word()], [Fake.word(), Fake.word()], [Fake.word(), Fake.word(), Fake.word()], [Fake.word(), Fake.word(), Fake.word(), Fake.word()]]),
                   uppers: ['K5c5M4Pbdg3B82wQH', 'K5c5M4Pbdg3B82wQI'],
                   location: undefined,
                   privacy_type: Partups.privacy_types.PUBLIC,
                   image: 'FTHbg6wbPxjiA4Y8w',
                   created_at : new Date('2015-03-26T16:25:07.816Z'),
                   end_date: new Date('2015-06-01T10:00:07.100Z'),
               });
            }
            */
        }
    }
});
