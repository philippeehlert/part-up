if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Collections', function() {
      it('should have users in database', function(done) {
        chai.assert(Meteor.users.find().count() > 0);
        done();
      });

      it('should have partups available', function(done) {
        chai.assert(Partups.find().count() > 0);
        done();
      });

      it('should have activities available', function(done) {
        chai.assert(Activities.find().count() > 0);
        done();
      });
    });
  });
}
