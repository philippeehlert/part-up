import { Collection, CollectionDocument } from 'collections/Collection';

export interface InviteDocument extends CollectionDocument {
    id: string;
    created_at: string;
    type: 'network_existing_upper' | 'partup_existing_upper' | 'activity_existing_upper';
    invitee_id: string;
    inviter_id: string;
    network_id?: string;
    activity_id?: string;
    partup_id?: string;
    dismissed?: boolean;
}

class InvitesCollection extends Collection<InviteDocument> {

}

export const Invites = new InvitesCollection({
    collection: 'invites',
});
