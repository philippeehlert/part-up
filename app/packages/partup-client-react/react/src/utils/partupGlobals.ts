import { Meteor } from 'utils/Meteor';

declare var analytics: any;

export const openPartupTakeModel = () => {
    if (Meteor.user()) {
        (window as any).Partup.client.popup.open({
            id: 'take-part',
        });
    } else {
        (window as any).Intent.go({
            route: 'login'
        }, (user: any) => {
            if (user) {
                (window as any).Partup.client.popup.open({
                    id: 'take-part'
                });
            }
        });
    }
}

export const joinPartupAsSupporter = (partupId: any) => {
    if (Meteor.user()) {
        becomeSupporter(partupId);
    } else {
        (window as any).Intent.go({
            route: 'login'
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
