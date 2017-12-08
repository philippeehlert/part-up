import { Collection, CollectionDocument } from 'collections/Collection';
import { get } from 'lodash';

export interface NetworkDocument extends CollectionDocument {
    id: string;
    name: string;
    image: string;
}

class NetworksCollection extends Collection<NetworkDocument> {

    public getSlugById = (networkId: string) => {
        const network = this.findOne({ _id: networkId });
        const staticNetwork = this.findOneStatic({ _id: networkId });

        return get(network, 'slug', get(staticNetwork, 'slug')) as string;
    }
}

export const Networks = new NetworksCollection({
    collection: 'networks',
});
