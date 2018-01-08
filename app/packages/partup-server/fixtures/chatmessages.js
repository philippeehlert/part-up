Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!ChatMessages.find().count()) {
      /* 1 */
      ChatMessages.insert({
        _id: 'BE4TBgt28wYR2HdKX',
        chat_id: 'JSGpNRF5R3gjEWcGf',
        content: 'Testmessage #1',
        created_at: new Date(),
        creator_id: 'K5c5M4Pbdg3B82wQH',
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      });

      /* 2 */
      ChatMessages.insert({
        _id: 'NL4TBgt28wYR2Hdug',
        chat_id: '9yscDD9bTkT2eDF4c',
        content: 'Private chat test',
        created_at: new Date(),
        creator_id: 'K5c5M4Pbdg3B82wQH',
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      });

      /* 3 */
      ChatMessages.insert({
        _id: 'DevTAf328wYR2BNyrt',
        chat_id: '9yscDD9bTkT2eDF4c',
        content: 'Private chat reply',
        created_at: new Date(),
        creator_id: 'K5c5M4Pbdg3B82wQI',
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      });

      /* 4 */
      ChatMessages.insert({
        _id: 'hU4TBgt28wYR2Hd8s',
        chat_id: 'wioZDD9bTkT2eDF4c',
        content: 'Hallo Lifely!',
        created_at: new Date(),
        creator_id: 'K5c5M4Pbdg3B82wQH',
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      });

      /* 5 */
      ChatMessages.insert({
        _id: 'itn3Bgt28wYR2H97z',
        chat_id: 'wioZDD9bTkT2eDF4c',
        content: 'Hey Default! Jij ook hier?',
        created_at: new Date(),
        creator_id: 'a7qcp5RHnh5rfaeW9',
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      });
    }
  }
});
