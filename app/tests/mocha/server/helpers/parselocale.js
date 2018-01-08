if (typeof MochaWeb !== 'undefined') {
  MochaWeb.testOnly(function() {
    let parseLocale = Partup.helpers.parseLocale;

    describe('parseLocale', function() {
      it('returns a default locale if none is passed', function() {
        chai.assert.equal(parseLocale(), 'en');
      });

      it('returns a default locale when passed a non-string value', function() {
        chai.assert.equal(parseLocale(undefined), 'en');
        chai.assert.equal(parseLocale({}), 'en');
        chai.assert.equal(parseLocale([]), 'en');
      });

      it('falls back to an optional default locale if the string cannot be parsed', function() {
        chai.assert.equal(parseLocale(undefined, 'nl'), 'nl');
        chai.assert.equal(parseLocale({}, 'nl'), 'nl');
        chai.assert.equal(parseLocale([], 'nl'), 'nl');
        chai.assert.equal(parseLocale('enn-GB', 'nl'), 'nl');
      });
    });
  });
}
