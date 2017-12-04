import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { ContentView } from 'components/View/ContentView';
import { FilteredListItems } from 'components/FilteredList/FilteredListItems';
import { FilteredList } from 'components/FilteredList/FilteredList';
// import { FilteredListControls } from 'components/FilteredList/FilteredListControls';
// import { Select } from 'components/Form/Select';
// import { Blank } from 'components/FillInTheBlanks/Blank';
import { ActivityTile } from 'components/ActivityTile/ActivityTile';
import { FilteredListSection } from 'components/FilteredList/FilteredListSection';
import { Icon } from 'components/Icon/Icon';
import { Button } from 'components/Button/Button';
import { Fetcher, mergeDataByKey } from 'utils/Fetcher';
import { Contributions, Contribution } from 'collections/Contributions';
import { Images, Image } from 'collections/Images';
import { Partups, Partup } from 'collections/Partups';
import { Users, User } from 'collections/Users';
import { Activities, Activity } from 'collections/Activities';
import { Spinner } from 'components/Spinner/Spinner';
import { InfiniteScroll } from 'components/InfiniteScroll/InfiniteScroll';

interface Props extends RouteComponentProps<any> {
    //
}

interface GroupedActivities {
    thisWeek: Activity[],
    nextWeek: Activity[],
    later: Activity[],
}

interface FetcherResponse {
    'cfs.images.filerecord': Image[],
    partups: Partup[],
    users: User[],
    activities: Activity[],
    contributions: Contribution[],
}

export class ActivitiesView extends React.Component<Props> {

    private skip = 0;
    private fetchedAll = false;

    private activitiesFetcher = new Fetcher<FetcherResponse, {groupedActivities: GroupedActivities}>({
        route: 'activities/me',
        query: {
            limit: 20,
            skip: 0,
        },
        onChange: () => this.forceUpdate(),
        onResponse: (data) => {
            const {
                'cfs.images.filerecord': images = [],
                partups = [],
                users = [],
                activities = [],
                contributions = [],
            } = data;

            Images.updateStatics(images);
            Partups.updateStatics(partups);
            Users.updateStatics(users);
            Activities.updateStatics(activities);
            Contributions.updateStatics(contributions);
        },
        transformData: (data) => {
            const {
                activities = [],
            } = data;

            const now = new Date();
            const nextWeek = moment(now).add(1, 'week');

            return {
                groupedActivities: activities.reduce((groupedActivities, activity) => {

                    if (moment(activity.end_date).isSame(now, 'week')) {
                        groupedActivities.thisWeek.push(activity);
                    } else if (moment(activity.end_date).isSame(nextWeek, 'week')) {
                        groupedActivities.nextWeek.push(activity);
                    } else {
                        groupedActivities.later.push(activity);
                    }

                    return groupedActivities;
                }, {
                    thisWeek: [],
                    nextWeek: [],
                    later: [],
                } as GroupedActivities),
            };
        },
    });

    public componentWillMount() {
        this.activitiesFetcher.fetch();
    }

    public render() {
        const { data, loading } = this.activitiesFetcher;
        const { groupedActivities } = data;

        return (
            <ContentView>

                <Button
                    leftChild={<Icon name={'chart'} />}>
                    Nieuwe activiteit
                </Button>

                <FilteredList>
                    {/* <FilteredListControls>
                        <Blank label={'Toon'}>
                            <Select options={[
                                { label: 'Actief', value: 'filterByAll', onChange: () => console.log('filterByAll') },
                                { label: 'Partner', value: 'filterByPartner', onChange: () => console.log('filterByPartner') },
                                { label: 'Supporter', value: 'filterBySupporter', onChange: () => console.log('filterBySupporter') },
                            ]} />
                        </Blank>
                    </FilteredListControls> */}
                    <FilteredListItems hasSubSections>
                        { (loading || !groupedActivities) ? (
                            <Spinner />
                        ) : (
                            <InfiniteScroll loadMore={this.loadMore}>
                                <FilteredListSection title={`This week`}>
                                    { groupedActivities.thisWeek.map(activity => (
                                        <ActivityTile key={activity._id} activity={activity} />
                                    )) }
                                </FilteredListSection>
                                <FilteredListSection title={`Next week`}>
                                    { groupedActivities.nextWeek.map(activity => (
                                        <ActivityTile key={activity._id} activity={activity} />
                                    )) }
                                </FilteredListSection>
                                <FilteredListSection title={`Later`}>
                                    { groupedActivities.later.map(activity => (
                                        <ActivityTile key={activity._id} activity={activity} />
                                    )) }
                                </FilteredListSection>
                            </InfiniteScroll>
                        )}
                    </FilteredListItems>
                </FilteredList>
            </ContentView>
        );
    }

    private loadMore = async (done: Function) => {
        if (this.fetchedAll) {
            return;
        }

        this.skip = this.skip + 20;

        await this.activitiesFetcher.fetchMore({
            skip: this.skip,
        }, mergeDataByKey('activities', () => {
            this.fetchedAll = true;
        }));

        done();
    }
}
