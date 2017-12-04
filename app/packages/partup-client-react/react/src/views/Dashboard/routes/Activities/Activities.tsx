import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { ContentView } from 'components/View/ContentView';
import { FilteredListItems } from 'components/FilteredList/FilteredListItems';
import { FilteredList } from 'components/FilteredList/FilteredList';
import { FilteredListControls } from 'components/FilteredList/FilteredListControls';
import { Select } from 'components/Form/Select';
import { Blank } from 'components/FillInTheBlanks/Blank';
import { ActivityTile } from 'components/ActivityTile/ActivityTile';
import { FilteredListSection } from 'components/FilteredList/FilteredListSection';
import { Icon } from 'components/Icon/Icon';
import { Button } from 'components/Button/Button';
import { Fetcher } from 'utils/Fetcher';
import { Contributions } from 'collections/Contributions';
import { Images } from 'collections/Images';
import { Partups } from 'collections/Partups';
import { Users } from 'collections/Users';
import { Activities, Activity } from 'collections/Activities';

interface Props extends RouteComponentProps<any> {
    //
}

interface GroupedActivities {
    thisWeek: Activity[],
    nextWeek: Activity[],
    later: Activity[],
}

export class ActivitiesView extends React.Component<Props> {

    private activitiesFetcher = new Fetcher<{groupedActivities: GroupedActivities}>({
        route: 'activities/me',
        query: {
            limit: 20,
            skip: 0,
        },
        onChange: () => this.forceUpdate(),
        onResponse: (data: any) => {
            Images.updateStatics(data['cfs.images.filerecord']);
            Partups.updateStatics(data.partups || []);
            Users.updateStatics(data.users);
            Activities.updateStatics(data.activities);
            Contributions.updateStatics(data.lanes);
        },
        transformData: (data) => {
            const {
                activities = [],
            }: {
                activities: Activity[],
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

        const { data } = this.activitiesFetcher;
        const { groupedActivities } = data;
        console.log(groupedActivities);

        return (
            <ContentView>

                <Button
                    leftChild={<Icon name={'chart'} />}>
                    Nieuwe activiteit
                </Button>

                <FilteredList>
                    <FilteredListControls>
                        <Blank label={'Toon'}>
                            <Select options={[
                                { label: 'Actief', value: 'filterByAll', onChange: () => console.log('filterByAll') },
                                { label: 'Partner', value: 'filterByPartner', onChange: () => console.log('filterByPartner') },
                                { label: 'Supporter', value: 'filterBySupporter', onChange: () => console.log('filterBySupporter') },
                            ]} />
                        </Blank>
                    </FilteredListControls>
                    <FilteredListItems hasSubSections>
                        <FilteredListSection title={`This week`}>
                            <ActivityTile />
                        </FilteredListSection>
                        <FilteredListSection title={`Next week`}>
                            <ActivityTile />
                        </FilteredListSection>
                        <FilteredListSection title={`Later`}>
                            <ActivityTile />
                        </FilteredListSection>
                    </FilteredListItems>
                </FilteredList>
            </ContentView>
        );
    }
}
