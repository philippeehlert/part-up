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

interface State {
    showOnboardingTile: boolean;
}

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

    public state: State = {
        showOnboardingTile: true,
    };

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
        const { invite, starredUpdates = [] } = data;

        if (loading || !data) {
            return <Spinner />;
        }

        return (
            <ContentView noPadding>
                {this.shouldShowInviteHeader() && (
                    <PartupInviteHeader invite={invite as InviteDocument} />
                )}
                <PartupDescriptionTile partup={partup} />
                {this.shouldShowOnboardingTile() && (
                    <PartupOnboardingTile invite={invite} partup={partup} onActionTaken={this.dismissOnboardingTile} />
                )}
                <StarredUpdates updates={starredUpdates} />
            </ContentView>
        );
    }

    private shouldShowInviteHeader() {
        const { data } = this.partupsFetcher;
        const user = Users.findLoggedInUser() as UserDocument;
        const partup = data.partup as PartupDocument;
        const { invite } = data;

        if (!user) {
            return false;
        }

        const userIsAMemberOrPending =
            Users.isSupporterOfUpperOfPartup(user, partup) ||
            Users.isPendingPartnerOfPartup(user, partup);

        return invite && !invite.dismissed && !userIsAMemberOrPending;
    }

    private shouldShowOnboardingTile() {
        const { data } = this.partupsFetcher;
        const { invite } = data;
        const { showOnboardingTile } = this.state;
        const partup = data.partup as PartupDocument;
        const user = Users.findLoggedInUser() as UserDocument;

        if (!user) {
            return true;
        }

        if (!showOnboardingTile) {
            return false;
        }

        if (Users.isSupporterOfUpperOfPartup(user, partup)) {
            return false;
        }

        if (Users.isPendingPartnerOfPartup(user, partup)) {
            return false;
        }

        if (Users.isFounderOfPartup(user, partup)) {
            return false;
        }

        if (invite && invite.dismissed) {
            return false;
        }

        return true;
    }

    private subscribeToUpdateComments = async () => {
        const updateIds = Updates.findStatic().map((update: UpdateDocument) => update._id);

        await this.updatesCommentsSubscriber.subscribe(updateIds, { system: false });
    }

    private dismissOnboardingTile = () => {
        this.setState({
            showOnboardingTile: false,
        })
    }
}
