Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Lanes.find().count()) {
      /* Default Lanes */
      /* Meteor Board */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4ze0',
        board_id: '9TEcgO45TkVBizotA',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* Incubator Board */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zr0',
        board_id: 'Gzmun04TtYiP8llQ1',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* ING CrowdFunding */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zt0',
        board_id: 'VItDJ3O3MpzeiPU5J',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* ING Super Secret */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zy0',
        board_id: 'sGrp9AkRSDVwXNZnn',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      /* ING - Semi Secret */
      /* 1) Backlog */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zaq',
        board_id: 'jMU371tasWnf0RYUh',
        name: 'Backlog',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* ToDo */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4za2',
        board_id: 'jMU371tasWnf0RYUh',
        name: 'ToDo',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* Doing */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4za3',
        board_id: 'jMU371tasWnf0RYUh',
        name: 'Doing',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* Done */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4za4',
        board_id: 'jMU371tasWnf0RYUh',
        name: 'Done',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      // ABcmVsH93LfFJr83P
      /* Part-up developement */
      /* Backlog */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zwq',
        board_id: 'vGaxNojSerdizDPj0',
        name: 'Backlog',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* ToDo */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zw2',
        board_id: 'vGaxNojSerdizDPj0',
        name: 'ToDo',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* Doing */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zw3',
        board_id: 'vGaxNojSerdizDPj0',
        name: 'Doing',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
      /* Done */
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zw4',
        board_id: 'vGaxNojSerdizDPj0',
        name: 'Done',
        activities: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }
});
