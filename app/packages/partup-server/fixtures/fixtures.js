import { concat, difference, find, range, sample, sampleSize, toLower } from 'lodash';
import Faker from 'faker';

Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        const chatIds = ['fMpNncPh4Qua6NANH', 'JSGpNRF5R3gjEWcGf', '9nTogbMy6Ddjfh6NP', 'wioZDD9bTkT2eDF4c', '9yscDD9bTkT2eDF4c', 'e6qqFXCFTrE5TNHbE', 'AZvyQ3qiSGjuuW5Am'];
        const sectorIds = ['9oNQGxTCKqvsTADnl', '2RmvKkMc2gPgZnp1U', 'kJxHQtMKoLsOKaoUh', 'olHytjJtx28UQL0sx', 'FhapMhLSOHcCCbPfO', 'xPqmVC0HXZSonoTXB', 'amBl1EcGQbS1D4yGD', 'GKrqvl5EPLuh7PpSm', 'nzlTJheV0FyyQOXsj', 'cK2VJSFpyqMY01jc5', 'vg9lIhHdym1a2NXNw', '73Nx9bizIW1IlYxs6', 'MFBPA6m09F2Qi0jGA', 'a0AvnFFexUtOho2FJ', 'EK44EKqmXHAMWvNEp'];
        const imageIds = ['raaNx9aqA6okiqaS4', 'SEswZsYiTTKTTdnN5', 'T8pfWebTJmvbBNJ2g', 'f7yzkqh9J9JvxCCqN', 'efDuvuTzpqH65P9DF', 'fReGXG4qkNXb4K8wp', 'PnYAg3EX5dKfEnkdn', '4rymNTA3jFfTRKtFJ', 'oQeqgwkdd44JSBSW5', 'cHhjpWKo9DHjXQQjy', 'bMTGT9oSDGzxCL3r4', 'CxEprGKNWo6HdrTdq', 'FTHbg6wbPxjiA4Y8w', 'D3zGxajTjWCLhXokS', 'ComeF2exAjeKBPAf8', 'J2KxajXMcqiKwrEBu', 'xfYreAouRFh4mnctk'];
        const partupTypes = ['charity', 'enterprising', 'commercial', 'organisation'];
        const partupPhases = ['brainstorm', 'plan', 'execute', 'grow'];
        
        const networkPrivacyTypes = range(1, 3);
        // const partupPrivacyTypes = range(1, 9);

        const maybe = percent =>
            input => (percent > Faker.random.number({ min: 0, max: 100 }) ? input : null);

        const match = (input, equal) =>
            value => (input === equal ? value : null);

        const dateBetweenAndNow = parent =>
            Faker.date.between(parent, Faker.date.between(parent, new Date()));

        const allTribes = ((() =>
            range(4).map(() => {
                const uppers = sampleSize(['K5c5M4Pbdg3B82wQI', 'q63Kii9wwJX3Q6rHS', 'a7qcp5RHnh5rfaeW9', 'efh2F9LHJwNPqvzKs', 'efh2F9LHJwNPqvzKU'], Faker.random.number({ min: 1, max: 5 }));
                const created = Faker.date.past();
                const updated = Faker.date.between(created, new Date());
                const name = Faker.random.words(Faker.random.number({ min: 2, max: 4 }));
                return {
                    _id: Random.id(),
                    chat_id: chatIds.pop(),
                    sector_id: sample(sectorIds),
                    name,
                    slug: name.split(' ').join('-'),
                    description: Faker.random.words(Faker.random.number({ min: 5, max: 50 })),
                    privacy_type: sample(networkPrivacyTypes),
                    language: Faker.random.locale(),
                    image: sample(imageIds),
                    icon: sample(imageIds),
                    admins: ['K5c5M4Pbdg3B82wQH'],
                    uppers,
                    upper_count: uppers.length,
                    created_at: created,
                    updated_at: updated,
                    stats: {},
                };
            }))());

        const allPartups = ((() =>
            range(30).map(() => {
                const { _id, language, created_at, admins, uppers } = sample(allTribes);
                const id = Random.id();
                const name = Faker.random.words(Faker.random.number({ min: 2, max: 4 }));
                const type = sample(partupTypes);
                const partupUppers = concat(admins, sampleSize(uppers));
                const partupSupporters = sampleSize(difference(uppers, partupUppers));
                const dateCreated = dateBetweenAndNow(created_at);
                // const dateEnd = dateBetweenAndFuture(created);
                // Random.date.between(created_at, Random.date.between(created_at, new Date()));

                return {
                    _id: id,
                    network_id: _id,
                    name,
                    slug: `${toLower(name.split(' ').join('-'))}-${id}`,
                    description: Faker.random.words(Faker.random.number({ min: 5, max: 50 })),
                    privacy_type: 4, // sample(partupPrivacyTypes),
                    language,
                    type,
                    type_commercial_budget: match(type, 'commercial')(maybe(80)(Faker.random.number({ min: 0, max: 50000 }))),
                    type_organisational_budget: match(type, 'organisational')(maybe(80)(Faker.random.number({ min: 0, max: 50000 }))),
                    currency: null,
                    uppers: partupUppers,
                    upper_data: partupUppers.map(x => ({ _id: x, new_updates: [] })),
                    supporters: partupSupporters,
                    creator_id: sample(partupUppers),
                    created_at: dateCreated,
                    end_date: Faker.date.future(),
                    phase: sample(partupPhases),
                    progress: '',
                    board_id: '',
                    board_view: maybe(80)(true) || false,
                    activity_count: '',
                    image: sample(imageIds),
                    tags: sampleSize(range(3, 12).map(Faker.random.word)),
                    location: {
                        city: 'Amsterdam',
                        lat: 52.3702157000000028,
                        lng: 4.8951679000000006,
                        place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
                        country: 'Netherlands',
                    },
                    analytics: {
                        clicks_total: 1,
                        clicks_per_day: 1,
                        clicks_per_hour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                        last_ip: '127.0.0.1',
                    },
                };
            }))());

        const allBoards = ((() =>
            range(30).map((_, i) => {
                const _id = Random.id();
                const partup = allPartups[i];
                const dateCreated = dateBetweenAndNow(partup.created_at);
                const dateUpdated = dateBetweenAndNow(dateCreated);

                partup.board_id = _id;

                return {
                    _id,
                    partup_id: partup._id,
                    created_at: dateCreated,
                    updated_at: dateUpdated,
                    lanes: [],
                };
            }))());

        const allLanes = ((() =>
            range(400).map(() => ({
                _id: Random.id(),
                name: Faker.random.word(),
                // board_id: '',
                activities: [],
            })))());

        const allActivities = ((() =>
            range(3000).map(() => ({
                _id: Random.id(),
                name: Faker.random.words(1, 4),
                description: Faker.random.words(3, 25),
                end_date: Faker.date.future(),
                archived: Faker.random.boolean(),
                files: {
                    documents: [],
                    images: [],
                },
                // update_id: '',
            })))());

        const mapFixtures = () => {
            allLanes.forEach((lane) => {
                const board = sample(allBoards);
                board.lanes.push(lane._id);
                lane.board_id = board._id;
            });

            allActivities.forEach((activity) => {
                const lane = sample(allLanes);
                activity.lane_id = lane._id;
                lane.activities.push(activity._id);

                const board = find(allBoards, b => b._id === lane.board_id);
                const partup = find(allPartups, p => p._id === board.partup_id);
                activity.partup_id = board.partup_id;
                activity.creator_id = sample(partup.uppers);
            });
        };
        const insertFixtures = () => {
            allTribes.forEach(network => Networks.insert(network));
            allPartups.forEach(partup => Partups.insert(partup));
            allBoards.forEach(board => Boards.insert(board));
            allLanes.forEach(lane => Lanes.insert(lane));
            allActivities.forEach(activity => Activities.insert(activity));
        };

        mapFixtures();
        insertFixtures();

        // Add messages to updates after the updates are created by the after insert trigger on activities.
        Meteor.defer(function () {
            const updates = Updates.find({ $or: [
                { 'type_data.activity_id': { $exists: true } },
                { 'type_data.partup_message_added': { $exists: true } },
            ] }).fetch();

            const users = [
                {
                    _id: 'K5c5M4Pbdg3B82wQH',
                    name: 'Default User',
                    image: 'oQeqgwkdd44JSBSW5',
                },
                {
                    _id: 'K5c5M4Pbdg3B82wQI',
                    name: 'John Partup',
                    image: 'cHhjpWKo9DHjXQQjy',
                },
                {
                    _id: 'a7qcp5RHnh5rfaeW9',
                    name: 'Judy Partup',
                    image: 'bMTGT9oSDGzxCL3r4',
                },
            ];

            updates.forEach((update) => {
                const user = sample(users);

                const comments = range(Faker.random.number({ min: 0, max: 20 })).map(() => ({
                    _id: Random.id(),
                    content: Faker.random.words(Faker.random.number({ min: 5, max: 30 })),
                    creator: user,
                    created_at: new Date(),
                    updated_at: new Date(),
                }));

                const updateFields = {
                    comments,
                };
                if (update.type_data.activity_id) {
                    updateFields.type = 'partups_activities_comments_added';
                    updateFields.upper_id = user._id;
                }
                Updates.update(update._id, {
                    $set: updateFields,
                    $inc: {
                        comments_count: comments.length,
                    },
                });
            });
        });
    }
});

