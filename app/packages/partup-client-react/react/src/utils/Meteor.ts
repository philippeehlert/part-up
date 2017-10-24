const { default: Meteor } = require('react-web-meteor');

declare global {
    interface Window { Meteor: any; }
}

if (!window.Meteor) {
    Meteor.startup = (cb:any) => cb();
    window.Meteor = Meteor;

    Meteor.connect('ws://localhost:3000/websocket');
}

export default Meteor;