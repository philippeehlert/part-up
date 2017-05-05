import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';

const marketo = {
    loaded: false,
    loadScript() {
        function initMunchkin() {
            if (!loaded) {
                loaded = true;
                Munchkin.init('449-VWG-450');
            }
        }
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//munchkin.marketo.net/munchkin.js';
        if (s.readyState) {
            s.onreadystatechange = () => {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    initMunchkin();
                }
            };
        }
        s.onload = initMunchkin;
        document.getElementsByTagName('body')[0].appendChild(s);
    }
};

Tracker.autorun((computation) => {
    if ((Cookies.get('cb-enabled') === 'enabled' || Session.get('cookiesEnabled') === 'enabled') && !marketo.loaded) {
        $(window).on('load', marketo.loadScript);
        computation.stop();
    }
});