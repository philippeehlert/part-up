if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe('Tags Service', function() {
      it('calculates changes between two arrays of tags', function() {
        let service = Partup.services.tags;

        chai.assert.deepEqual(
          service.calculateChanges(['a', 'b'], ['c', 'd']),
          [
            {
              type: 'changed',
              old_tag: 'a',
              new_tag: 'c',
            },
            {
              type: 'changed',
              old_tag: 'b',
              new_tag: 'd',
            },
          ]
        );

        chai.assert.deepEqual(service.calculateChanges([], ['a', 'b']), [
          {
            type: 'added',
            new_tag: 'a',
          },
          {
            type: 'added',
            new_tag: 'b',
          },
        ]);

        chai.assert.deepEqual(service.calculateChanges(['a', 'b'], []), [
          {
            type: 'removed',
            old_tag: 'a',
          },
          {
            type: 'removed',
            old_tag: 'b',
          },
        ]);

        chai.assert.deepEqual(service.calculateChanges(['a', 'b'], ['c']), [
          {
            type: 'changed',
            old_tag: 'a',
            new_tag: 'c',
          },
          {
            type: 'removed',
            old_tag: 'b',
          },
        ]);
      });
    });
  });
}
