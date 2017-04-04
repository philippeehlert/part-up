Meteor.startup(function () {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        if (!Boards.find().count()) {
            
            /* Organize Meteor board */
            Boards.insert({
                '_id': '9TEcgO45TkVBizotA',
                'partup_id': 'vGaxNojSerdizDPjb',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': ['WFcjbTeEDeiY5XC9N']
            });
            /* Incubator board */
            Boards.insert({
                '_id': 'Gzmun04TtYiP8llQ1',
                'partup_id': 'IGhBN2Z3mrA90j3g7',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': ['srPWJgxWcLhIlAuxA']
            });
            /* Partup developement board */
            Boards.insert({
                '_id': 'ABcmVsH93LfFJr83P',
                'partup_id': '1csyxDMvVcBjb8tFM',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': [
                    'M8yEL4e3zY7Ar4zwq',
                    'B17gCkMaSWtnKK4JZ',
                    'J023aUccH2gmRFWQn',
                    '7tjMjDjMMSOS40zhu'
                ]
            });

            /* ING Crowd funding */
            Boards.insert({
                '_id': 'VItDJ3O3MpzeiPU5J',
                'partup_id': 'gJngF65ZWyS9f3NDE',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': ['hUGKnG6VRqFfuXtch']
            });

            /* ING Super Secret */
            Boards.insert({
                '_id': 'sGrp9AkRSDVwXNZnn',
                'partup_id': 'CJETReuE6uo2eF7eW',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': ['U6MgEtdp8uBESETTb']
            });

            /* ING Semi Secret */
            Boards.insert({
                '_id': 'jMU371tasWnf0RYUh',
                'partup_id': 'ASfRYBAzo2ayYk5si',
                'created_at': new Date(),
                'updated_at': new Date(),
                'lanes': [
                    'OhElHekpR1I3PxUBt',
                    '7I8qkr9jKLISr7GQC',
                    '1c18TM9EhTUbIMGCy',
                    'MURSLchoBESuQJVpn'
                ]
            });
        }
    }
});
