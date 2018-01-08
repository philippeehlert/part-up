if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Strings Service', function() {
      it('slugifies string', function(done) {
        chai.assert.equal(
          Partup.client.strings.slugify('Accounts.LoginCancelledError'),
          'accounts-logincancellederror'
        );
        chai.assert.equal(
          Partup.client.strings.slugify('bla afterspace'),
          'bla-afterspace'
        );
        done();
      });
    });
  });
}
