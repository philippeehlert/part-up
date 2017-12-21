import { Meteor } from 'utils/Meteor';

declare var analytics: any;

export const openPartupTakeModel = () => (window as any).Partup.client.popup.open({ id: 'take-part' });

export const joinPartupAsSupporter = (partupId: any) => Meteor.call('partups.supporters.insert', partupId, (error: any) => {
    if (error) {
        return;
    }

    analytics.track('became supporter', {
        partupId: partupId,
    });
});
