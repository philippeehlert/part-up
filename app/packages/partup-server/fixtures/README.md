# Fixtures
Fixtures are used to test on localhost and the staging environments.
The fixture data is stored in a local mongo collection which is accesible via: *'localhost:3001'*. You can use [RoboMongo](https://robomongo.org/) to access the collections.

## Updating fixture data
Whenever a change is made to the domain of part-up the fixture data should be updated to reflect the changes made. When starting the app meteor checks if there is a collection in mongo and only runs the fixtures if non-existing or empty. Therefore a collection should be cleared or dropped after updating the fixtures before saving the document or restarting the app.

## _ids
Meteor/Mongo auto generates the _id value of an entity, the following procedure should be followed to be sure _id values are valid:

1. Start the app;
2. In a second terminal window navigate to the app folder;
3. *type* '**meteor shell**';
4. *type*: **import { Random } from 'meteor/random'**
5. *use*: '**Random.id()**' to generate a valid _id.

## Loops & unique values
Sometimes more entities are needed for testing. An example can be found in users.js which has a loop to add users in order to test pagination.
> In order to keep values unique the **Random** library can also be used inside the JS files itself.  
> Example: Random.name() or Random.Array[Random.name(), Random.name()]
