import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

const marketto = {
    didInit: false,
    loadScript() {
        function initMunchkin() {
            if (didInit === false) {
                didInit = true
                Munchkin.init('449-VWG-450')
            }
        }
        var s = document.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = '//munchkin.marketo.net/munchkin.js'
        s.onreadystatechange = function () {
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                initMunchkin()
            }
        };
        s.onload = initMunchkin
        document.getElementsByTagName('body')[0].appendChild(s)
    }
}

Tracker.autorun((computation) => {
    if ((Cookies.get('cb-enabled') === 'enabled' || Session.get('cookiesEnabled') === 'enabled') && !marketto.didInit) {
        $(window).on('load', marketto.loadScript)
        computation.stop()
    }
})