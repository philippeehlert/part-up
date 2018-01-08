if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Partup Service', function() {
      it('transforms a partup location to a location input', function(done) {
        let location = {
          city: 'Amsterdam',
          lat: 52.3702157000000028,
          lng: 4.8951679000000006,
          place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
          country: 'Netherlands',
        };
        chai.assert.equal(
          Partup.services.location.locationToLocationInput(location),
          'ChIJVXealLU_xkcRja_At0z9AGY'
        );
        done();
      });
    });
  });
}
