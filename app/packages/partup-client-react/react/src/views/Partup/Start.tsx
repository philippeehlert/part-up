import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Fetcher } from 'utils/Fetcher';
import { PartupDocument, Partups } from 'collections/Partups';
import { Images, ImageDocument } from 'collections/Images';
import { Users, UserDocument } from 'collections/Users';
import { InviteDocument, Invites } from 'collections/Invites';
import { PartupDescriptionTile } from 'components/PartupDescriptionTile/PartupDescriptionTile';
import { Spinner } from 'components/Spinner/Spinner';
import { PartupOnboardingTile } from 'components/PartupOnboardingTile/PartupOnboardingTile';
import { ContentView } from 'components/View/ContentView';
import { Networks, NetworkDocument } from 'collections/Networks';
import { PartupInviteHeader } from 'components/PartupInviteHeader/PartupInviteHeader';
import { Updates, ConversationUpdateDocument, UpdateDocument } from 'collections/Updates';
import { Lanes, LaneDocument } from 'collections/Lanes';
import { Activities, ActivityDocument } from 'collections/Activities';
import { StarredUpdates } from 'components/StarredUpdates/StarredUpdates';
import { Subscriber } from 'utils/Subscriber';

interface RouteParams {}

interface Props extends RouteComponentProps<RouteParams> {
    className?: string;
    partupId: string;
}

interface State {}

interface FetcherResponse {
    partups: PartupDocument[];
    users: UserDocument[];
    'cfs.images.filerecord': ImageDocument[];
    invites: InviteDocument[];
    networks: NetworkDocument[];
    updates: ConversationUpdateDocument[];
    activities: ActivityDocument[];
    lanes: LaneDocument[];
}

export class Start extends React.Component<Props, State> {

    private partupsFetcher = new Fetcher<FetcherResponse, {
        partup: PartupDocument|null,
        invite: InviteDocument|null,
        starredUpdates: ConversationUpdateDocument[],
    }>({
        route: 'partups/start',
        onChange: () => this.forceUpdate(),
        onResponse: (data) => {
            const {
                'cfs.images.filerecord': images = [],
                partups = [],
                users = [],
                invites = [],
                networks = [],
                updates = [],
                activities = [],
                lanes = [],
            } = data;

            Images.updateStatics(images);
            Partups.updateStatics(partups);
            Users.updateStatics(users);
            Invites.updateStatics(invites);
            Networks.updateStatics(networks);
            Updates.updateStatics(updates);
            Activities.updateStatics(activities);
            Lanes.updateStatics(lanes);

            this.subscribeToUpdateComments();
        },
        transformData: (data) => {
            return {
                starredUpdates: data.updates,
                partup: data.partups[0],
                invite: data.invites ? data.invites[0] : null,
            };
        },
    });

    private updatesCommentsSubscriber = new Subscriber({
        subscription: 'updates.comments_by_update_ids',
        onStateChange: () => this.forceUpdate(),
    });

    public componentWillMount() {
        const { partupId } = this.props;

        this.partupsFetcher.fetch({ partupId });
    }

    public componentWillUnmount() {
        this.updatesCommentsSubscriber.destroy();
        this.partupsFetcher.destroy();
    }

    public render() {
        const { data, loading } = this.partupsFetcher;
        const partup = data.partup as PartupDocument;
        const { invite, starredUpdates } = data;

        if (loading || !data) {
            return <Spinner />;
        }

        const userIsAMember = Users.isSuporterOfUpperOfPartup(Users.findLoggedInUser() as UserDocument, partup);

        return (
            <ContentView noPadding>
                {!userIsAMember && (
                    <React.Fragment>
                        {invite && (
                            <PartupInviteHeader invite={invite} />
                        )}
                        <PartupOnboardingTile partup={partup} />
                    </React.Fragment>
                )}
                <PartupDescriptionTile partup={partup} />
                { starredUpdates.length ? (
                    <StarredUpdates updates={starredUpdates} />
                ) : (
                    <p>Er zijn nog geen starred updates.</p>
                ) }
            </ContentView>
        );
    }

    private subscribeToUpdateComments = async () => {
        const updateIds = Updates.findStatic().map((update: UpdateDocument) => update._id);

        await this.updatesCommentsSubscriber.subscribe(updateIds, { system: false });
    }
}
