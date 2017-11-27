import * as React from 'react';
import * as PropTypes from 'prop-types';
import { get, uniqBy } from 'lodash';
import { AppContext } from 'App';
import { Images } from 'collections/Images';
import { Partups } from 'collections/Partups';
import { Fetcher } from 'utils/Fetcher';

import { FilteredList } from 'components/FilteredList/FilteredList';
import { FilteredListControls } from 'components/FilteredList/FilteredListControls';
import { FillInTheBlanks } from 'components/FillInTheBlanks/FillInTheBlanks';
import { Blank } from 'components/FillInTheBlanks/Blank';
import { Select } from 'components/Form/Select';
import { FilteredListItems } from 'components/FilteredList/FilteredListItems';
import { Spinner } from 'components/Spinner/Spinner';
import { InfiniteScroll } from 'components/InfiniteScroll/InfiniteScroll';
import { Tile } from 'components/Tile/Tile';
import { UpdateTile } from 'components/UpdateTile/UpdateTile';
import { SystemAvatar } from 'components/Avatar/SystemAvatar';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { UpdateTileComments } from 'components/UpdateTile/UpdateTileComments';
import { UpdateTileMeta } from 'components/UpdateTile/UpdateTileMeta';
import { UpdateTileContent } from 'components/UpdateTile/UpdateTileContent';
import { ChangedRegion } from 'components/Update/ChangedRegion';
import { ContributionAccepted } from 'components/Update/ContributionAccepted';
import { ContributionAdded } from 'components/Update/ContributionAdded';
import { ContributionChanged } from 'components/Update/ContributionChanged';
import { ContributionCommentAdded } from 'components/Update/ContributionCommentAdded';
import { ContributionProposed } from 'components/Update/ContributionProposed';
import { ContributionRemoved } from 'components/Update/ContributionRemoved';
import { NetworkPrivate } from 'components/Update/NetworkPrivate';
import { NetworkPublic } from 'components/Update/NetworkPublic';
import { PartupActivityAdded } from 'components/Update/PartupActivityAdded';
import { PartupActivityArchived } from 'components/Update/PartupActivityArchived';
import { PartupActivityChanged } from 'components/Update/PartupActivityChanged';
import { PartupActivityCommentAdded } from 'components/Update/PartupActivityCommentAdded';
import { PartupActivityRemoved } from 'components/Update/PartupActivityRemoved';
import { PartupActivityUnarchived } from 'components/Update/PartupActivityUnarchived';
import { PartupArchived } from 'components/Update/PartupArchived';
import { PartupBudgetChanged } from 'components/Update/PartupBudgetChanged';
import { PartupCommentAdded } from 'components/Update/PartupCommentAdded';
import { PartupCreated } from 'components/Update/PartupCreated';
import { PartupDescriptionChanged } from 'components/Update/PartupDescriptionChanged';
import { PartupEndDateChanged } from 'components/Update/PartupEndDateChanged';
import { PartupImageChanged } from 'components/Update/PartupImageChanged';
import { PartupInvited } from 'components/Update/PartupInvited';
import { PartupLocationChanged } from 'components/Update/PartupLocationChanged';
import { PartupMessageAdded } from 'components/Update/PartupMessageAdded';
import { PartupNameChanged } from 'components/Update/PartupNameChanged';
import { PartupPartnerRejected } from 'components/Update/PartupPartnerRejected';
import { PartupPartnerRequest } from 'components/Update/PartupPartnerRequest';
import { PartupRatingChanged } from 'components/Update/PartupRatingChanged';
import { PartupRatingInserted } from 'components/Update/PartupRatingInserted';
import { PartupSupporterAdded } from 'components/Update/PartupSupporterAdded';
import { PartupTagAdded } from 'components/Update/PartupTagAdded';
import { PartupTagChanged } from 'components/Update/PartupTagChanged';
import { PartupTagRemoved } from 'components/Update/PartupTagRemoved';
import { PartupUnarchived } from 'components/Update/PartupUnarchived';
import { PartupUpperAdded } from 'components/Update/PartupUpperAdded';
import { Rated } from 'components/Update/Rated';
import { SystemSupporterRemoved } from 'components/Update/SystemSupporterRemoved';

export class ConversationUpdates extends React.Component {

    public static contextTypes = {
        user: PropTypes.object,
    };

    public context: AppContext;

    private filters: {[key: string]: any} = {};

    private skip = 0;
    private fetchedAll = false;

    private conversationsFetcher = new Fetcher({
        route: 'partups/updates',
        query: {
            limit: 20,
            skip: 0,
        },
        onChange: () => this.forceUpdate(),
        onResponse: (data: any) => {
            Images.updateStatic(data['cfs.images.filerecord']);
            Partups.updateStatic(data.partups || []);
        },
        transformData: (data: any) => {
            const {
                updates = [],
                partups = [],
                users = [],
                activities = [],
                lanes = [],
            }: {
                updates: any[],
                partups: any[],
                users: any[],
                activities: any[],
                lanes: any[],
            } = data;

            activities.forEach((activity) => {
                activity.lane = lanes.find(({ _id }) => _id === activity.lane_id);
            });

            return {
                updates: updates.map((update: any) => ({
                    ...update,
                    partup: partups.find(({ _id }) => update.partup_id === _id),
                    upper: users.find(({ _id }) => update.upper_id === _id),
                    activity: activities.find(({ update_id }) => update_id === update._id),
                })),
            };
        },
    });

    private partupsFetcher = new Fetcher({
        route: 'partups/me',
        onChange: () => this.forceUpdate(),
    });

    public componentWillMount() {
        this.conversationsFetcher.fetch();
        this.partupsFetcher.fetch();
    }

    public componentWillUnmount() {
        this.conversationsFetcher.destroy();
        this.partupsFetcher.destroy();
    }

    public render() {
        const { data, loading } = this.conversationsFetcher;
        const { data: partupsData } = this.partupsFetcher;
        const { updates = [] } = data;
        const { partups = [] } = partupsData;

        const partupOptions = this.getPartupOptions(partups);

        return (
            <FilteredList>
                <FilteredListControls>
                    <FillInTheBlanks>
                        <Blank label={'Toon updates als'}>
                            <Select options={[
                                { label: 'Alle', value: 'filterByAll', onChange: () => this.filterBy('filterByAll') },
                                { label: 'Partner', value: 'filterByPartner', onChange: () => this.filterBy('filterByPartner') },
                                { label: 'Supporter', value: 'filterBySupporter', onChange: () => this.filterBy('filterBySupporter') },
                            ]} />
                        </Blank>
                        <Blank label={'van'}>
                            <Select options={[
                                { label: 'Alle partups', value: 'all' },
                                ...partupOptions,
                            ]} onChange={(ev) => this.filterByPartup(ev.currentTarget.value)} />
                        </Blank>
                    </FillInTheBlanks>
                </FilteredListControls>
                <FilteredListItems>
                    { loading && !updates.length && (
                        <Spinner />
                    ) }
                    <InfiniteScroll loadMore={this.loadMore}>
                        { !!updates.length && updates.map((update: any) => {
                            const upper = update.upper;
                            return (
                                <Tile title={update.partup.name} key={update._id}>
                                    <UpdateTile>
                                        <UpdateTileMeta
                                            avatar={update.system ? <SystemAvatar /> : <UserAvatar user={upper} />}
                                            postedAt={update.created_at}
                                        >
                                            { this.renderUpdateTitle(update, get(upper, 'profile.name')) }
                                        </UpdateTileMeta>
                                        { this.shouldRenderUpdateComponent(update) && (
                                            <UpdateTileContent>
                                                { this.renderUpdateComponent(update) }
                                            </UpdateTileContent>
                                        )}
                                        <UpdateTileComments update={update} comments={update.comments || []} />
                                    </UpdateTile>
                                </Tile>
                            );
                        }) }
                    </InfiniteScroll>
                </FilteredListItems>
            </FilteredList>
        );
    }

    private filterBy(type: 'filterByAll' | 'filterByPartner'| 'filterBySupporter') {
        this.skip = 0;
        this.fetchedAll = false;

        const options = {
            filterByAll: false,
            filterByPartner: false,
            filterBySupporter: false,
            [type]: true,
        };

        this.filters = {
            ...this.filters,
            supporterOnly: !options.filterByAll && options.filterBySupporter,
            upperOnly: !options.filterByAll && options.filterByPartner,
        };

        this.conversationsFetcher.fetch(this.filters);
    }

    private filterByPartup(partupId: string) {
        this.skip = 0;
        this.fetchedAll = false;

        if (partupId === 'all' && this.filters.partupId) {
            delete this.filters.partupId;
        } else if (partupId !== 'all') {
            this.filters = {
                ...this.filterBy,
                partupId: partupId,
            };
        }

        this.conversationsFetcher.fetch(this.filters);
    }

    private loadMore = async (done: Function) => {
        if (this.fetchedAll) {
            return;
        }

        this.skip = this.skip + 20;

        await this.conversationsFetcher.fetchMore({
            ...this.filters,
            skip: this.skip,
        }, (oldData, newData) => {
            if (!newData.updates) {
                this.fetchedAll = true;
            }

            return {
                ['cfs.images.filerecord']: uniqBy([
                    ...oldData['cfs.images.filerecord'],
                    ...newData['cfs.images.filerecord'],
                ], '_id'),
                updates: uniqBy([
                    ...oldData.updates,
                    ...(newData.updates || []),
                ], '_id'),
                partups: uniqBy([
                    ...oldData.partups,
                    ...(newData.partups || []),
                ], '_id'),
                users: uniqBy([
                    ...oldData.users,
                    ...(newData.users || []),
                ], '_id'),
                activities: uniqBy([
                    ...oldData.activities,
                    ...(newData.activities || []),
                ], '_id'),
                lanes: uniqBy([
                    ...oldData.lanes,
                    ...(newData.lanes || []),
                ], '_id'),
            };
        });

        done();
    }

    private shouldRenderUpdateComponent({ type }: {type: string}) {
        return {
            changed_region:                       () => true,
            partups_contributions_accepted:       () => true,
            partups_contributions_added:          () => true,
            partups_contributions_changed:        () => true,
            partups_contributions_comments_added: () => true,
            partups_contributions_proposed:       () => true,
            partups_contributions_removed:        () => true,
            network_private:                      () => true,
            network_public:                       () => true,
            partups_activities_added:             () => true,
            partups_activities_archived:          () => true,
            partups_activities_changed:           () => true,
            partups_activities_comments_added:    () => true,
            partups_activities_removed:           () => true,
            partups_activities_unarchived:        () => true,
            partups_archived:                     () => false, // no update content
            partups_budget_changed:               () => true,
            partups_comments_added:               () => false, // no update content
            partups_created:                      () => false, // no update content
            partups_description_changed:          () => true,
            partups_end_date_changed:             () => true,
            partups_image_changed:                () => true,
            partups_invited:                      () => false, // no update content
            partups_location_changed:             () => true,
            partups_message_added:                () => true,
            partups_name_changed:                 () => true,
            partups_partner_rejected:             () => true,
            partups_partner_request:              () => true,
            partup_partner_request:               () => false,
            partups_ratings_changed:              () => true,
            partups_ratings_inserted:             () => true,
            partups_supporters_added:             () => false, // no update content
            partups_tags_added:                   () => true,
            partups_tags_changed:                 () => true,
            partups_tags_removed:                 () => true,
            partups_unarchived:                   () => false, // no update content
            partups_uppers_added:                 () => false, // no update content
            rated:                                () => true,
            system_supporters_removed:            () => true,
        }[type]();
    }

    private renderUpdateComponent({ type, ...update }: {type: string, typeData: {[key: string]: any}}) {

        const table = {
            changed_region:                       (data: any) => <ChangedRegion data={data} />,
            partups_contributions_accepted:       (data: any) => <ContributionAccepted data={data} />,
            partups_contributions_added:          (data: any) => <ContributionAdded data={data} />,
            partups_contributions_changed:        (data: any) => <ContributionChanged />,
            partups_contributions_comments_added: (data: any) => <ContributionCommentAdded />,
            partups_contributions_proposed:       (data: any) => <ContributionProposed />,
            partups_contributions_removed:        (data: any) => <ContributionRemoved />,
            network_private:                      (data: any) => <NetworkPrivate />,
            network_public:                       (data: any) => <NetworkPublic />,
            partups_activities_added:             (data: any) => <PartupActivityAdded data={data} />,
            partups_activities_archived:          (data: any) => <PartupActivityArchived data={data} />,
            partups_activities_changed:           (data: any) => <PartupActivityChanged data={data} />,
            partups_activities_comments_added:    (data: any) => <PartupActivityCommentAdded data={data} />,
            partups_activities_removed:           (data: any) => <PartupActivityRemoved data={data} />,
            partups_activities_unarchived:        (data: any) => <PartupActivityUnarchived data={data} />,
            partups_archived:                     (data: any) => <PartupArchived data={data} />, // no update content
            partups_budget_changed:               (data: any) => <PartupBudgetChanged />,
            partups_comments_added:               (data: any) => <PartupCommentAdded />, // no update content
            partups_created:                      (data: any) => <PartupCreated data={data} />, // no update content
            partups_description_changed:          (data: any) => <PartupDescriptionChanged data={data} />,
            partups_end_date_changed:             (data: any) => <PartupEndDateChanged data={data} />,
            partups_image_changed:                (data: any) => <PartupImageChanged data={data} />,
            partups_invited:                      (data: any) => <PartupInvited data={data} />, // no update content
            partups_location_changed:             (data: any) => <PartupLocationChanged />,
            partups_message_added:                (data: any) => <PartupMessageAdded data={data} />,
            partups_name_changed:                 (data: any) => <PartupNameChanged data={data} />,
            partups_partner_rejected:             (data: any) => <PartupPartnerRejected />,
            partups_partner_request:              (data: any) => <PartupPartnerRequest />,
            partup_partner_request:               (data: any) => <PartupPartnerRequest />,
            partups_ratings_changed:              (data: any) => <PartupRatingChanged />,
            partups_ratings_inserted:             (data: any) => <PartupRatingInserted />,
            partups_supporters_added:             (data: any) => <PartupSupporterAdded data={data} />, // no update content
            partups_tags_added:                   (data: any) => <PartupTagAdded data={data} />,
            partups_tags_changed:                 (data: any) => <PartupTagChanged data={data} />,
            partups_tags_removed:                 (data: any) => <PartupTagRemoved data={data} />,
            partups_unarchived:                   (data: any) => <PartupUnarchived data={data} />, // no update content
            partups_uppers_added:                 (data: any) => <PartupUpperAdded data={data} />, // no update content
            rated:                                (data: any) => <Rated />,
            system_supporters_removed:            (data: any) => <SystemSupporterRemoved />,
        };

        return table[type](update);
    }

    private renderUpdateTitle({ type, typeData }: {type: string, typeData: {[key: string]: any}}, upperName: string) {

        const map = {
            changed_region:                       (postee: any) => `${postee} changed the part-up location`,
            network_private:                      (postee: any) => `${postee} made this part-up visible for invited uppers only`,
            network_public:                       (postee: any) => `${postee} made this part-up visible for everyone`,
            partups_activities_added:             (postee: any) => `${postee} added an activity`,
            partups_activities_archived:          (postee: any) => `${postee} archived an activity`,
            partups_activities_changed:           (postee: any) => `${postee} changed an activity`,
            partups_activities_comments_added:    (postee: any) => `${postee} commented on an activity`,
            partups_activities_removed:           (postee: any) => `${postee} removed an activity`,
            partups_activities_unarchived:        (postee: any) => `${postee} reactivated an activity`,
            partups_archived:                     (postee: any) => `${postee} archived the part-up`,
            partups_budget_changed:               (postee: any) => `${postee} changed the budget`,
            partups_comments_added:               (postee: any) => `${postee} commented`,
            partups_contributions_accepted:       (postee: any) => `${postee} accepted a contribution to '__activity__'`,
            partups_contributions_added:          (postee: any) => `${postee} will work on '__activity__'`,
            partups_contributions_changed:        (postee: any) => `${postee} changed a contribution to '__activity__'`,
            partups_contributions_comments_added: (postee: any) => `${postee} commented on a contribution`,
            partups_contributions_proposed:       (postee: any) => `${postee} proposed to contribute to '__activity__'`,
            partups_contributions_removed:        (postee: any) => `${postee} removed a contribution from '__activity__'`,
            partups_created:                      (postee: any) => `${postee} created the part-up`,
            partups_description_changed:          (postee: any) => `${postee} changed the part-up description`,
            partups_end_date_changed:             (postee: any) => `${postee} changed the end date`,
            partups_image_changed:                (postee: any) => `${postee} changed the part-up picture`,
            partups_invited:                      (postee: any) => `${postee} invited __invitee_names__ for this part-up`,
            partups_location_changed:             (postee: any) => `${postee} changed the part-up region`,
            partups_message_added:                (postee: any) => `${postee} added a message`,
            partups_name_changed:                 (postee: any) => `${postee} changed the part-up title`,
            partups_partner_rejected:             (postee: any) => `${postee} was declined as partner in this part-up`,
            partups_partner_request:              (postee: any) => `${postee} wants to become partner in this part-up`,
            partups_ratings_changed:              (postee: any) => `${postee} changed the rating for __contributor__ on '__activity__'`,
            partups_ratings_inserted:             (postee: any) => `${postee} rated the contribution of __contributor__ on '__activity__'`,
            partups_supporters_added:             (postee: any) => `${postee} is supporter now`,
            partups_tags_added:                   (postee: any) => `${postee} added a label`,
            partups_tags_changed:                 (postee: any) => `${postee} changed a label`,
            partups_tags_removed:                 (postee: any) => `${postee} removed a label`,
            partups_unarchived:                   (postee: any) => `${postee} reactivated the part-up`,
            partups_uppers_added:                 (postee: any) => `${postee} is partner in this part-up now`,
            rated:                                (postee: any) => `${postee} rated __contributor__ on '__activity__'`,
            system_supporters_removed:            (postee: any) => `${postee} is not a supporter anymore`,
        };

        return map[type](upperName, typeData);
    }

    private getPartupOptions(partups: any) {
        return partups.filter(({ _id }: any) => {
            if (!this.context.user || (!this.filters.supporterOnly && !this.filters.upperOnly)) {
                return true;
            }

            if (this.filters.supporterOnly) {
                return this.context.user.supporterOf.includes(_id);
            }

            if (this.filters.upperOnly) {
                return this.context.user.upperOf.includes(_id);
            }

            return false;
        }).map((partup: any) => ({
            label: partup.name,
            value: partup._id,
        }));
    }
}
