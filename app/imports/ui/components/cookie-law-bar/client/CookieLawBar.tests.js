import { chai } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from '../../../test-helpers';
import * as Cookies from './cookies.min';
import './CookieLawBar';

describe('CookieLawBar tests', function() {
  beforeEach(function() {
    Template.registerHelper('_', (key) => key);
  });

  afterEach(function() {
    Template.deregisterHelper('_');
    Cookies.set('cb-enabled', undefined);
  });

  it('should have cookie text', function() {
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      chai
        .expect(
          $(el)
            .find('#cookie-bar p')
            .html()
        )
        .to.match(/\w+/);
    });
  });

  it('should have more-info with http link', function() {
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      console.log($(el).html());
      chai
        .expect(
          $(el)
            .find('#cookie-bar .more-info')
            .html()
        )
        .to.match(/\w+/);
    });
  });

  it('should have cookie text', function() {
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      chai
        .expect(
          $(el)
            .find('#cookie-bar p')
            .html()
        )
        .to.match(/\w+/);
    });
  });

  it('should have accept button', function() {
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      chai.expect($(el).find('#cookie-bar .cb-enable').length).not.to.equal(0);
    });
  });

  it('should show cookiebar when Cookie is NOT set', function() {
    Cookies.set('cb-enabled', undefined);
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      chai
        .expect(
          $(el)
            .find('#cookie-bar')
            .css('display') !== 'none'
        )
        .to.equal(true);
    });
  });

  it('should NOT show cookiebar when Cookie is set', function() {
    Cookies.set('cb-enabled', 'enabled', { expires: Infinity });
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      chai
        .expect(
          $(el)
            .find('#cookie-bar')
            .css('display') === 'none'
        )
        .to.equal(true);
    });
  });

  it('should remove cookiebar after clicking the cookie accept button', function() {
    chai.expect(Cookies.get('cb-enabled')).to.be.undefined;
    Cookies.set('cb-enabled', 'enabled', { expires: Infinity });
    withRenderedTemplate('CookieLawBar', {}, (el) => {
      $(el)
        .find('#cookie-bar .cb-enable')
        .click();
      chai
        .expect(
          $(el)
            .find('#cookie-bar')
            .css('display') === 'none'
        )
        .to.equal(true);
    });
  });
});
