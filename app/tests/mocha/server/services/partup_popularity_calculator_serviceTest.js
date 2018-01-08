if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Partup Popularity Calculator', function() {
      describe('Share based score', function() {
        let service = Partup.server.services.partup_popularity_calculator;

        it('shares - little shares low score', function(done) {
          let partup = {
            shared_count: {
              facebook: 1,
              twitter: 1,
              linkedin: 1,
              email: 1,
            },
          };
          chai.assert.equal(service._calculateShareBasedScore(partup), 4);
          done();
        });

        it('shares - lots of shares high score', function(done) {
          let partup = {
            shared_count: {
              facebook: 30,
              twitter: 30,
              linkedin: 30,
              email: 30,
            },
          };
          chai.assert.equal(service._calculateShareBasedScore(partup), 100);
          done();
        });
      });

      describe('Partner based score', function() {
        let service = Partup.server.services.partup_popularity_calculator;
        it('no partners, no score', function(done) {
          let partup = {
            uppers: [],
          };
          chai.assert.equal(service._calculatePartnerBasedScore(partup), 0);
          done();
        });
        it('3 partners, low score', function(done) {
          let partup = {
            uppers: ['1231231313', '1231231313', '1231231313'],
          };
          chai.assert.equal(service._calculatePartnerBasedScore(partup), 20);
          done();
        });
        it('15 partners full score', function(done) {
          let partup = {
            uppers: [
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
            ],
          };
          chai.assert.equal(service._calculatePartnerBasedScore(partup), 100);
          done();
        });
        it('16 partners still high score', function(done) {
          let partup = {
            uppers: [
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
            ],
          };
          chai.assert.equal(service._calculatePartnerBasedScore(partup), 100);
          done();
        });
      });

      describe('Supporter based score', function() {
        let service = Partup.server.services.partup_popularity_calculator;
        it('no supporters, no score', function(done) {
          let partup = {
            supporters: [],
          };
          chai.assert.equal(service._calculateSupporterBasedScore(partup), 0);
          done();
        });
        it('3 supporters, low score', function(done) {
          let partup = {
            supporters: ['1231231313', '1231231313', '1231231313'],
          };
          chai.assert.equal(service._calculateSupporterBasedScore(partup), 3);
          done();
        });
        it('100 supporters full score', function(done) {
          let partup = {
            supporters: [
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
              '1231231313',
            ],
          };
          chai.assert.equal(service._calculateSupporterBasedScore(partup), 100);
          done();
        });
      });

      describe('View based score', function() {
        let service = Partup.server.services.partup_popularity_calculator;
        it('no views, no score', function(done) {
          let partup = {
            analytics: {
              clicks_total: 0,
            },
          };
          chai.assert.equal(service._calculateViewBasedScore(partup), 0);
          done();
        });

        it('big views, big score', function(done) {
          let partup = {
            analytics: {
              clicks_total: 500,
            },
          };
          chai.assert.equal(service._calculateViewBasedScore(partup), 100);
          done();
        });

        it('gargantor views, big score', function(done) {
          let partup = {
            analytics: {
              clicks_total: 1500,
            },
          };
          chai.assert.equal(service._calculateViewBasedScore(partup), 100);
          done();
        });
      });
    });
  });
}
