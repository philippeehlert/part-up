if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Validator Service', function() {
      describe('tagsSeparatedByComma', function() {
        let tagsSeparatedByComma =
          Partup.services.validators.tagsSeparatedByComma;

        it('works with correct word input', function(done) {
          let correctTags = 'test,test2,test3';
          chai.assert.isTrue(tagsSeparatedByComma.test(correctTags));
          done();
        });

        it('works with correct dashed input', function(done) {
          let tagsWithDash = 'test,test2,test3,test4,part-up';
          chai.assert.isTrue(tagsSeparatedByComma.test(tagsWithDash));
          done();
        });

        it('works with incorrect specialchar input', function(done) {
          let tagsWithSpecialchars = 'tüst,tést2';
          chai.assert.isTrue(tagsSeparatedByComma.test(tagsWithSpecialchars));
          done();
        });

        it('works with incorrect tags', function(done) {
          let incorrectTags = 'test@,test2,test3,test4,part-up';
          chai.assert.isFalse(tagsSeparatedByComma.test(incorrectTags));
          done();
        });
      });

      describe('facebookUrl', function() {
        let facebookUrl = Partup.services.validators.facebookUrl;

        it('works with correct word input', function(done) {
          chai.assert.isTrue(facebookUrl.test('https://www.facebook.com/zuck'));
          chai.assert.isTrue(facebookUrl.test('https://facebook.com/zuck'));
          chai.assert.isTrue(facebookUrl.test('http://facebook.com/zuck'));
          chai.assert.isTrue(
            facebookUrl.test('https://facebook.com/zuck?_rdr=p')
          );
          chai.assert.isTrue(
            facebookUrl.test('https://facebook.com/zuc.k?_rdr=p')
          );
          chai.assert.isTrue(
            facebookUrl.test('https://facebook.com/zuck?_rdr=p')
          );
          chai.assert.isFalse(facebookUrl.test('https://exploit.com'));
          chai.assert.isFalse(
            facebookUrl.test('https://exploit.com/zuck?_rdr=')
          );
          done();
        });
      });

      describe('instagramUrl', function() {
        let instagramUrl = Partup.services.validators.instagramUrl;

        it('works with correct word input', function(done) {
          chai.assert.isTrue(
            instagramUrl.test('https://www.instagram.com/zuck')
          );
          chai.assert.isTrue(
            instagramUrl.test('http://www.instagram.com/zuck')
          );
          chai.assert.isTrue(
            instagramUrl.test('https://www.instagram.com/zuck/')
          );
          chai.assert.isTrue(
            instagramUrl.test('https://www.instagram.com/mark.zuck/')
          );
          chai.assert.isTrue(
            instagramUrl.test('https://www.instagram.com/mark_zuck/')
          );
          chai.assert.isTrue(
            instagramUrl.test('https://www.instagram.com/mark-zuck/')
          );
          chai.assert.isFalse(instagramUrl.test('https://exploit.com'));
          chai.assert.isFalse(
            instagramUrl.test('https://exploit.com/mark-zuck')
          );
          done();
        });
      });
      describe('linkedinUrl', function() {
        let linkedinUrl = Partup.services.validators.linkedinUrl;

        it('works with correct word input', function(done) {
          chai.assert.isTrue(
            linkedinUrl.test(
              'https://de.linkedin.com/pub/matthias-graus/65/a02/649/en'
            )
          );
          chai.assert.isTrue(
            linkedinUrl.test(
              'https://nl.linkedin.com/pub/jacob-peerdeman/51/758/796/en'
            )
          );
          chai.assert.isTrue(
            linkedinUrl.test('https://www.linkedin.com/in/peterpeerdeman')
          );
          chai.assert.isTrue(
            linkedinUrl.test('https://linkedin.com/in/peterpeerdeman')
          );
          chai.assert.isTrue(
            linkedinUrl.test('http://linkedin.com/profile/view?id=365894620')
          );
          chai.assert.isTrue(
            linkedinUrl.test('https://linkedin.com/profile/view?id=365894620')
          );
          chai.assert.isFalse(
            linkedinUrl.test(
              'https://nl_nl.linkedin.com/pub/jacob-peerdeman/51/758/796/en'
            )
          );
          chai.assert.isFalse(linkedinUrl.test('https://exploit.com'));
          chai.assert.isFalse(
            linkedinUrl.test('https://exploit.com/in/peterpeerdeman')
          );
          done();
        });
      });
      describe('twitterUrl', function() {
        let twitterUrl = Partup.services.validators.twitterUrl;

        it('works with correct word input', function(done) {
          chai.assert.isTrue(
            twitterUrl.test('https://twitter.com/peterpeerdeman')
          );
          chai.assert.isTrue(
            twitterUrl.test('http://twitter.com/peterpeerdeman')
          );
          chai.assert.isTrue(twitterUrl.test('https://twitter.com/jessed_vrs'));
          chai.assert.isTrue(
            twitterUrl.test('https://twitter.com/jessedvrs09')
          );
          chai.assert.isTrue(twitterUrl.test('https://twitter.com/jessedVRS'));
          chai.assert.isTrue(twitterUrl.test('https://twitter.com/jessed-vrs'));
          chai.assert.isFalse(twitterUrl.test('https://exploit.com'));
          chai.assert.isFalse(
            twitterUrl.test('https://exploit.com/in/peterpeerdeman')
          );
          done();
        });
      });
    });
  });
}
