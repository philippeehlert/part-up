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
import { Fetcher, mergeDataByKey } from 'utils/Fetcher';
import { Contributions, ContributionDocument } from 'collections/Contributions';
import { Images, ImageDocument } from 'collections/Images';
import { Partups, PartupDocument } from 'collections/Partups';
import { Users, UserDocument } from 'collections/Users';
import { Activities, ActivityDocument } from 'collections/Activities';
import { Spinner } from 'components/Spinner/Spinner';
import { InfiniteScroll } from 'components/InfiniteScroll/InfiniteScroll';
import { PortalManager } from 'components/PortalManager/PortalManager';
import { ModalPortal } from 'components/Modal/ModalPortal';
import { Form } from 'components/Form/Form';
import { ModalWindow } from 'components/Modal/ModalWindow';
import { ModalHeader } from 'components/Modal/ModalHeader';
import { ModalContent } from 'components/Modal/ModalContent';
import { FieldCollection } from 'components/Form/FieldCollection';
import { FieldSet } from 'components/Form/FieldSet';
import { Label } from 'components/Form/Label';
import { Input } from 'components/Form/Input';
import { ModalFooter } from 'components/Modal/ModalFooter';
import { List } from 'components/List/List';
import { ListItem } from 'components/List/ListItem';

interface Props extends RouteComponentProps<any> {
    //
}

interface GroupedActivities {
    thisWeek: ActivityDocument[];
    nextWeek: ActivityDocument[];
    later: ActivityDocument[];
}

interface FetcherResponse {
    'cfs.images.filerecord': ImageDocument[];
    partups: PartupDocument[];
    users: UserDocument[];
    activities: ActivityDocument[];
    contributions: ContributionDocument[];
}

export class ActivitiesView extends React.Component<Props> {

    private skip = 0;
    private fetchedAll = false;

    private filters: {[key: string]: any} = {
        filterByActive: true,
        filterByArchived: false,
    };

    private defaultQueryVars = {
        limit: 20,
        skip: 0,
        ...this.filters,
    };

    private activitiesFetcher = new Fetcher<FetcherResponse, {groupedActivities: GroupedActivities}>({
        route: 'activities/me',
        query: {
            ...this.defaultQueryVars,
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
                    if (activity.end_date && moment(activity.end_date).isSame(now, 'week')) {
                        groupedActivities.thisWeek.push(activity);
                    } else if (activity.end_date && moment(activity.end_date).isSame(nextWeek, 'week')) {
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

        const renderActivity = (activity: ActivityDocument) => (
            <ActivityTile
                key={activity._id}
                activity={activity}
                onChange={() => this.activitiesFetcher.fetch({
                    skip: this.skip,
                    ...this.filters,
                })}
            />
        );

        return (
            <ContentView>

                <PortalManager
                    renderHandler={(open) => (
                        <Button
                            onClick={open}
                            leftChild={<Icon name={'chart'} />}>
                            Nieuwe activiteit
                        </Button>
                    )}
                    renderPortal={(close) => (
                        <ModalPortal onBackgroundClick={close}>

                            <Form onSubmit={(e: any, fields: any) => {
                                // tslint:disable-next-line:no-console
                                console.log(fields);
                            }}>
                                <ModalWindow>
                                    <ModalHeader
                                        onClose={close}
                                        title={'Plaats een nieuw bericht'} />
                                    <ModalContent>
                                        <FieldCollection>
                                            <FieldSet>
                                                <Label label={'Field label'}>
                                                    <Input type={'text'} name={'fieldname'} />
                                                </Label>
                                            </FieldSet>
                                        </FieldCollection>
                                    </ModalContent>
                                    <ModalFooter>
                                        <List horizontal>
                                            <ListItem alignRight>
                                                <Button type={'button'} onClick={close}>Annuleren</Button>
                                            </ListItem>
                                            <ListItem alignRight>
                                                <Button type={'submit'}>Plaats bericht</Button>
                                            </ListItem>
                                        </List>
                                    </ModalFooter>
                                </ModalWindow>
                            </Form>
                        </ModalPortal>
                    )}
                />

                <FilteredList>
                    <FilteredListControls>
                        <Blank label={'Toon'}>
                            <Select options={[
                                { label: 'Actief', value: 'filterByActive', onChange: this.filterBy('filterByActive') },
                                { label: 'Gearchiveerd', value: 'filterByArchived', onChange: this.filterBy('filterByArchived') },
                            ]} />
                        </Blank>
                    </FilteredListControls>
                    <FilteredListItems hasSubSections>
                        { (loading || !groupedActivities) ? (
                            <Spinner />
                        ) : (
                            <InfiniteScroll loadMore={this.loadMore}>
                                <FilteredListSection title={`This week`}>
                                    { groupedActivities.thisWeek.map(renderActivity) }
                                </FilteredListSection>
                                <FilteredListSection title={`Next week`}>
                                    { groupedActivities.nextWeek.map(renderActivity) }
                                </FilteredListSection>
                                <FilteredListSection title={`Later`}>
                                    { groupedActivities.later.map(renderActivity) }
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
            ...this.filters,
        }, mergeDataByKey('activities', () => {
            this.fetchedAll = true;
        }));

        done();
    }

    private filterBy = (filterByKey: string) => async () => {
        this.skip = 0,
        this.filters = {
            ...(Object.keys(this.filters).reduce((filters, key) => {
                filters[key] = false;
                return filters;
            }, {})),
            [filterByKey]: true,
        };

        this.fetchedAll = false;

        await this.activitiesFetcher.fetch({
            skip: this.skip,
            ...this.filters,
        });
    }
}
