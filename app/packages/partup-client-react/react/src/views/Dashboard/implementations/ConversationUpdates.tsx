import * as React from 'react';
import { get } from 'lodash';

import UpdateTile, { UpdateTileMeta, UpdateTileContent, UpdateTileComments } from 'components/UpdateTile';

import Images from 'collections/Images';

import {
    Tile,
    Spinner,
} from 'components';

import {
    ChangedRegion,
    ContributionAccepted,
    ContributionAdded,
    ContributionChanged,
    ContributionCommentAdded,
    ContributionProposed,
    ContributionRemoved,
    NetworkPrivate,
    NetworkPublic,
    PartupActivityAdded,
    PartupActivityArchived,
    PartupActivityChanged,
    PartupActivityCommentAdded,
    PartupActivityRemoved,
    PartupActivityUnarchived,
    PartupArchived,
    PartupBudgetChanged,
    PartupCommentAdded,
    PartupCreated,
    PartupDescriptionChanged,
    PartupEndDateChanged,
    PartupImageChanged,
    PartupInvited,
    PartupLocationChanged,
    PartupMessageAdded,
    PartupNameChanged,
    PartupPartnerRejected,
    PartupPartnerRequest,
    PartupRatingChanged,
    PartupRatingInserted,
    PartupSupporterAdded,
    PartupTagAdded,
    PartupTagChanged,
    PartupTagRemoved,
    PartupUnarchived,
    PartupUpperAdded,
    Rated,
    SystemSupporterRemoved,
} from 'components/Update';

import FilteredList, {
    FilteredListControls,
    FilteredListItems,
} from 'components/FilteredList';

import { UserAvatar, SystemAvatar } from 'components/Avatar';

import FillInTheBlanks, { Blank } from 'components/FillInTheBlanks';

import Fetcher from 'utils/Fetcher';

export default class ConversationUpdates extends React.Component {

    private fetcher = new Fetcher({
        route: 'partups/updates',
        query: {
            limit: 25,
            skip: 0,
            supporterOnly: true,
        },
        onChange: () => this.forceUpdate(),
        onResponse: (data: any) => {
            Images.updateStatic(data['cfs.images.filerecord']);
        },
        transformData: (data: any) => {
            const {
                updates = [],
                partups = [],
                users = [],
            }: {
                updates: any[],
                partups: any[],
                users: any[],
            } = data;

            return {
                updates: updates.map((update: any) => ({
                    ...update,
                    partup: partups.find(({_id}) => update.partup_id === _id),
                    upper: users.find(({_id}) => update.upper_id === _id),
                })),
            };
        },
    });

    componentWillMount() {
        this.fetcher.fetch();
    }

    componentWillUnmount() {
        this.fetcher.destroy();
    }

    render() {
        const { data, loading } = this.fetcher;
        const { updates = [] } = data;

        return (
            <FilteredList>
                <FilteredListControls>
                    <FillInTheBlanks>
                        <Blank label={'Toon updates als'}>
                            <select>
                                <option>hoi</option>
                            </select>
                        </Blank>
                        <Blank label={'van'}>
                            <select>
                                <option>hoi</option>
                            </select>
                        </Blank>
                    </FillInTheBlanks>
                </FilteredListControls>
                <FilteredListItems>
                    { loading && !updates.length && (
                        <Spinner />
                    ) }
                    { !!updates.length && updates.map((update: any) => {
                        const upper = update.upper;
                        return (
                            <Tile title={update.partup.name} key={update._id}>
                                <UpdateTile>
                                    <UpdateTileMeta
                                        avatar={update.system ? <SystemAvatar /> :  <UserAvatar user={upper} />}
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
                </FilteredListItems>
            </FilteredList>
        );
    }

    private shouldRenderUpdateComponent({type}: {type: string}) {
        return {
            'changed_region':                          () => true,
            'partups_contributions_accepted':          () => true,
            'partups_contributions_added':             () => true,
            'partups_contributions_changed':           () => true,
            'partups_contributions_comments_added':    () => true,
            'partups_contributions_proposed':          () => true,
            'partups_contributions_removed':           () => true,
            'network_private':                         () => true,
            'network_public':                          () => true,
            'partups_activities_added':                () => true,
            'partups_activities_archived':             () => true,
            'partups_activities_changed':              () => true,
            'partups_activities_comments_added':       () => true,
            'partups_activities_removed':              () => true,
            'partups_activities_unarchived':           () => true,
            'partups_archived':                        () => false, // no update content
            'partups_budget_changed':                  () => true,
            'partups_comments_added':                  () => false, // no update content
            'partups_created':                         () => false, // no update content
            'partups_description_changed':             () => true,
            'partups_end_date_changed':                () => true,
            'partups_image_changed':                   () => true,
            'partups_invited':                         () => false, // no update content
            'partups_location_changed':                () => true,
            'partups_message_added':                   () => true,
            'partups_name_changed':                    () => true,
            'partups_partner_rejected':                () => true,
            'partups_partner_request':                 () => true,
            'partups_ratings_changed':                 () => true,
            'partups_ratings_inserted':                () => true,
            'partups_supporters_added':                () => false, // no update content
            'partups_tags_added':                      () => true,
            'partups_tags_changed':                    () => true,
            'partups_tags_removed':                    () => true,
            'partups_unarchived':                      () => false, // no update content
            'partups_uppers_added':                    () => false, // no update content
            'rated':                                   () => true,
            'system_supporters_removed':               () => true,
        }[type]();
    }

    private renderUpdateComponent({type, ...update}: {type: string, typeData: {[key: string]: any}}) {

        const table = {
            'changed_region':                          (data: any) => <ChangedRegion data={data} />,
            'partups_contributions_accepted':          (data: any) => <ContributionAccepted data={data} />,
            'partups_contributions_added':             (data: any) => <ContributionAdded data={data} />,
            'partups_contributions_changed':           (data: any) => <ContributionChanged />,
            'partups_contributions_comments_added':    (data: any) => <ContributionCommentAdded />,
            'partups_contributions_proposed':          (data: any) => <ContributionProposed />,
            'partups_contributions_removed':           (data: any) => <ContributionRemoved />,
            'network_private':                         (data: any) => <NetworkPrivate />,
            'network_public':                          (data: any) => <NetworkPublic />,
            'partups_activities_added':                (data: any) => <PartupActivityAdded data={data} />,
            'partups_activities_archived':             (data: any) => <PartupActivityArchived data={data} />,
            'partups_activities_changed':              (data: any) => <PartupActivityChanged data={data} />,
            'partups_activities_comments_added':       (data: any) => <PartupActivityCommentAdded data={data} />,
            'partups_activities_removed':              (data: any) => <PartupActivityRemoved data={data} />,
            'partups_activities_unarchived':           (data: any) => <PartupActivityUnarchived data={data} />,
            'partups_archived':                        (data: any) => <PartupArchived data={data} />, // no update content
            'partups_budget_changed':                  (data: any) => <PartupBudgetChanged />,
            'partups_comments_added':                  (data: any) => <PartupCommentAdded />, // no update content
            'partups_created':                         (data: any) => <PartupCreated data={data} />, // no update content
            'partups_description_changed':             (data: any) => <PartupDescriptionChanged data={data} />,
            'partups_end_date_changed':                (data: any) => <PartupEndDateChanged data={data} />,
            'partups_image_changed':                   (data: any) => <PartupImageChanged data={data} />,
            'partups_invited':                         (data: any) => <PartupInvited data={data} />, // no update content
            'partups_location_changed':                (data: any) => <PartupLocationChanged />,
            'partups_message_added':                   (data: any) => <PartupMessageAdded data={data} />,
            'partups_name_changed':                    (data: any) => <PartupNameChanged data={data} />,
            'partups_partner_rejected':                (data: any) => <PartupPartnerRejected />,
            'partups_partner_request':                 (data: any) => <PartupPartnerRequest />,
            'partups_ratings_changed':                 (data: any) => <PartupRatingChanged />,
            'partups_ratings_inserted':                (data: any) => <PartupRatingInserted />,
            'partups_supporters_added':                (data: any) => <PartupSupporterAdded data={data} />, // no update content
            'partups_tags_added':                      (data: any) => <PartupTagAdded data={data} />,
            'partups_tags_changed':                    (data: any) => <PartupTagChanged data={data} />,
            'partups_tags_removed':                    (data: any) => <PartupTagRemoved data={data} />,
            'partups_unarchived':                      (data: any) => <PartupUnarchived data={data} />, // no update content
            'partups_uppers_added':                    (data: any) => <PartupUpperAdded data={data} />, // no update content
            'rated':                                   (data: any) => <Rated />,
            'system_supporters_removed':               (data: any) => <SystemSupporterRemoved />,
        };

        return table[type](update);
    }

    private renderUpdateTitle({type, typeData}: {type: string, typeData: {[key: string]: any}}, upperName: string) {

        const map = {
            'changed_region': (postee: any) => `${postee} changed the part-up location`,
            'network_private': (postee: any) => `${postee} made this part-up visible for invited uppers only`,
            'network_public': (postee: any) => `${postee} made this part-up visible for everyone`,
            'partups_activities_added': (postee: any) => `${postee} added an activity`,
            'partups_activities_archived': (postee: any) => `${postee} archived an activity`,
            'partups_activities_changed': (postee: any) => `${postee} changed an activity`,
            'partups_activities_comments_added': (postee: any) => `${postee} commented on an activity`,
            'partups_activities_removed': (postee: any) => `${postee} removed an activity`,
            'partups_activities_unarchived': (postee: any) => `${postee} reactivated an activity`,
            'partups_archived': (postee: any) => `${postee} archived the part-up`,
            'partups_budget_changed': (postee: any) => `${postee} changed the budget`,
            'partups_comments_added': (postee: any) => `${postee} commented`,
            'partups_contributions_accepted': (postee: any) => `${postee} accepted a contribution to '__activity__'`,
            'partups_contributions_added': (postee: any) => `${postee} will work on '__activity__'`,
            'partups_contributions_changed': (postee: any) => `${postee} changed a contribution to '__activity__'`,
            'partups_contributions_comments_added': (postee: any) => `${postee} commented on a contribution`,
            'partups_contributions_proposed': (postee: any) => `${postee} proposed to contribute to '__activity__'`,
            'partups_contributions_removed': (postee: any) => `${postee} removed a contribution from '__activity__'`,
            'partups_created': (postee: any) => `${postee} created the part-up`,
            'partups_description_changed': (postee: any) => `${postee} changed the part-up description`,
            'partups_end_date_changed': (postee: any) => `${postee} changed the end date`,
            'partups_image_changed': (postee: any) => `${postee} changed the part-up picture`,
            'partups_invited': (postee: any) => `${postee} invited __invitee_names__ for this part-up`,
            'partups_location_changed': (postee: any) => `${postee} changed the part-up region`,
            'partups_message_added': (postee: any) => `${postee} added a message`,
            'partups_name_changed': (postee: any) => `${postee} changed the part-up title`,
            'partups_partner_rejected': (postee: any) => `${postee} was declined as partner in this part-up`,
            'partups_partner_request': (postee: any) => `${postee} wants to become partner in this part-up`,
            'partups_ratings_changed': (postee: any) => `${postee} changed the rating for __contributor__ on '__activity__'`,
            'partups_ratings_inserted': (postee: any) => `${postee} rated the contribution of __contributor__ on '__activity__'`,
            'partups_supporters_added': (postee: any) => `${postee} is supporter now`,
            'partups_tags_added': (postee: any) => `${postee} added a label`,
            'partups_tags_changed': (postee: any) => `${postee} changed a label`,
            'partups_tags_removed': (postee: any) => `${postee} removed a label`,
            'partups_unarchived': (postee: any) => `${postee} reactivated the part-up`,
            'partups_uppers_added': (postee: any) => `${postee} is partner in this part-up now`,
            'rated': (postee: any) => `${postee} rated __contributor__ on '__activity__'`,
            'system_supporters_removed': (postee: any) => `${postee} is not a supporter anymore`,
        };

        return map[type](upperName, typeData);
    }
}
