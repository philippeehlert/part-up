import { Meteor } from 'utils/Meteor';

declare var analytics: any;
declare var Intent: any;
declare var Partup: any;

export const openPartupTakeModel = () => {
    if (Meteor.user()) {
        Partup.client.popup.open({
            id: 'take-part',
        });
    } else {
        Intent.go({
            route: 'login',
        }, (user: any) => {
            if (user) {
                Partup.client.popup.open({
                    id: 'take-part',
                });
            }
        });
    }
};

export const joinPartupAsSupporter = (partupId: any) => {
    if (Meteor.user()) {
        becomeSupporter(partupId);
    } else {
        Intent.go({
            route: 'login',
        }, (user: any) => {
            if (user) {
                becomeSupporter(partupId);
            }
        });
    }
};

const becomeSupporter = (partupId: string) => {
    Meteor.call('partups.supporters.insert', partupId, (error: any) => {
        if (error) {
            return;
        }

        analytics.track('became supporter', {
            partupId: partupId,
        });
    });
};
