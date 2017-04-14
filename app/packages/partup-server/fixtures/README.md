# Fixtures

Fixtures are used to test on localhost and the staging environments.

## _ids
Meteor/Mongo auto generate the _id values of an entity and do not accept any 17 character alphanumeric value. Therefor the following procedure should be followed to be sure _id values are valid.

1. Start the app;
2. In a second terminal window navigate to the app folder;
3. *type* '**meteor shell**';
4. *type*: **import { Random } from 'meteor/random'**
5. *use*: '**Random.id()**' to generate a valid _id.

## Using updated fixtures
Changes to fixtures are not automatically updated in Mongo. The fixtures are run at startup and only updates if the collection is empty. This means the mongo collection should be dropped before changes will be updated to mongo, this can be done by using [RoboMongo](https://robomongo.org/).
Meteor runs mongo on: *'localhost:3001'*
