import './pluploader';

describe('pluploader', function() {
  it('creates a new pluploader without config', function() {
    let pluploader = new Pluploader();
    chai.assert.isNotNull(pluploader, 'pluploader is not null');
  });
});
