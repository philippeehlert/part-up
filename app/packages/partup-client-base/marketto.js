import { $ } from 'meteor/jquery';

const mk = {
    didInit: false,
    loadMarketto() {
        function initMunchkin() {
            if (didInit === false) {
                didInit = true;
                Munchkin.init('449-VWG-450');
            }
        }
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//munchkin.marketo.net/munchkin.js';
        s.onreadystatechange = function () {
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                initMunchkin();
            }
        };
        s.onload = initMunchkin;
        document.getElementsByTagName('body')[0].appendChild(s);
    }
}

Meteor.startup(function () {
    $(window).load(function () {
        if (Cookies.get('cb-enabled') === 'enabled') {
            mk.loadMarketto();
        } else {
            $(document).on('click', '.cb-enable', function () {
                if (mk.didInit) return;
                mk.loadMarketto();
            });
        }
    });
})