import * as React from 'react';

import UpdateTile, { UpdateTileMeta, UpdateTileContent, UpdateTileComments } from 'components/UpdateTile';

import {
    Tile,
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

import FillInTheBlanks, { Blank } from 'components/FillInTheBlanks';

import Fetcher from 'utils/Fetcher';

export default class ConversationUpdates extends React.Component {

    private fetcher = new Fetcher({
        route: 'partups/updates',
        onChange: () => this.forceUpdate(),
    });

    componentWillMount() {
        this.fetcher.fetch();
    }

    render() {
        const { data }: {data: {
            updates: any[],
            partups: any[],
            users: any[],
        } } = this.fetcher;

        let {
            updates = [],
            partups = [],
            users = [],
        } = data;

        updates = updates.map((update: any) => {

            return ({
                ...update,
                partup: partups.find(({ _id }: {_id: string}) => update.partup_id === _id),
                upperUser: users.find(({ _id }: {_id: string}) => update.upper_id === _id),
            });
        });

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
                    { updates.map((update: any) => {
                        const postee = update.upperUser || update.partup;
                        const posteeName = postee.profile
                            ? (postee.profile.normalized_name || postee.profile.name)
                            : postee.name;

                        return (
                            <Tile title={update.partup.name} key={update._id}>
                                <UpdateTile>
                                    <UpdateTileMeta
                                        postedBy={postee}
                                        postedAt={update.created_at}
                                    >
                                        { this.renderUpdateTitle(update.type, posteeName, update.type_data) }
                                    </UpdateTileMeta>
                                    <UpdateTileContent>
                                        { this.renderUpdateComponent(update.type, update.type_data) }
                                    </UpdateTileContent>
                                    <UpdateTileComments comments={update.comments || []} />
                                </UpdateTile>
                            </Tile>
                        );
                    }) }
                </FilteredListItems>
            </FilteredList>
        );
    }

    private renderUpdateComponent(type: string, typeData: {[key: string]: any} ) {

        const table = {
            'partups_message_added':                   (data: any) => <PartupMessageAdded />,
            'changed_region':                          (data: any) => <ChangedRegion />,
            'network_private':                         (data: any) => <NetworkPrivate />,
            'network_public':                          (data: any) => <NetworkPublic />,
            'partups_activities_added':                (data: any) => <PartupActivityAdded />,
            'partups_activities_archived':             (data: any) => <PartupActivityArchived />,
            'partups_activities_changed':              (data: any) => <PartupActivityChanged />,
            'partups_activities_comments_added':       (data: any) => <PartupActivityCommentAdded />,
            'partups_activities_removed':              (data: any) => <PartupActivityRemoved />,
            'partups_activities_unarchived':           (data: any) => <PartupActivityUnarchived />,
            'partups_archived':                        (data: any) => <PartupArchived />,
            'partups_budget_changed':                  (data: any) => <PartupBudgetChanged />,
            'partups_comments_added':                  (data: any) => <PartupCommentAdded />,
            'partups_contributions_accepted':          (data: any) => <ContributionAccepted />,
            'partups_contributions_added':             (data: any) => <ContributionAdded />,
            'partups_contributions_changed':           (data: any) => <ContributionChanged />,
            'partups_contributions_comments_added':    (data: any) => <ContributionCommentAdded />,
            'partups_contributions_proposed':          (data: any) => <ContributionProposed />,
            'partups_contributions_removed':           (data: any) => <ContributionRemoved />,
            'partups_created':                         (data: any) => <PartupCreated />,
            'partups_description_changed':             (data: any) => <PartupDescriptionChanged />,
            'partups_end_date_changed':                (data: any) => <PartupEndDateChanged />,
            'partups_image_changed':                   (data: any) => <PartupImageChanged />,
            'partups_invited':                         (data: any) => <PartupInvited />,
            'partups_location_changed':                (data: any) => <PartupLocationChanged />,
            'partups_name_changed':                    (data: any) => <PartupNameChanged />,
            'partups_partner_rejected':                (data: any) => <PartupPartnerRejected />,
            'partups_partner_request':                 (data: any) => <PartupPartnerRequest />,
            'partups_ratings_changed':                 (data: any) => <PartupRatingChanged />,
            'partups_ratings_inserted':                (data: any) => <PartupRatingInserted />,
            'partups_supporters_added':                (data: any) => <PartupSupporterAdded />,
            'partups_tags_added':                      (data: any) => <PartupTagAdded />,
            'partups_tags_changed':                    (data: any) => <PartupTagChanged />,
            'partups_tags_removed':                    (data: any) => <PartupTagRemoved />,
            'partups_unarchived':                      (data: any) => <PartupUnarchived />,
            'partups_uppers_added':                    (data: any) => <PartupUpperAdded />,
            'rated':                                   (data: any) => <Rated />,
            'system_supporters_removed':               (data: any) => <SystemSupporterRemoved />,
        };

        return table[type](typeData);
    }

    private renderUpdateTitle(type: string, poster: any, typeData: any) {

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

        return map[type](poster, typeData);
    }
}
