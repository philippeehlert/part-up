import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ContentView } from 'components/View/ContentView';
import { FilteredListItems } from 'components/FilteredList/FilteredListItems';
import { FilteredList } from 'components/FilteredList/FilteredList';
import { FilteredListControls } from 'components/FilteredList/FilteredListControls';
import { Select } from 'components/Form/Select';
import { Blank } from 'components/FillInTheBlanks/Blank';
import { Fetcher, mergeDataByKey } from 'utils/Fetcher';
import { Spinner } from 'components/Spinner/Spinner';
import { InfiniteScroll } from 'components/InfiniteScroll/InfiniteScroll';
import { translate } from 'utils/translate';
import { ImageDocument, Images } from 'collections/Images';
import { PartupDocument, Partups } from 'collections/Partups';
import { UserDocument, Users } from 'collections/Users';
import { InviteDocument, Invites } from 'collections/Invites';
import { InviteTile } from 'components/InviteTile/InviteTile';
import { Activities, ActivityDocument } from 'collections/Activities';
import { Networks, NetworkDocument } from 'collections/Networks';

interface Props extends RouteComponentProps<any> {
    //
}

interface FetcherResponse {
    'cfs.images.filerecord': ImageDocument[];
    partups: PartupDocument[];
    users: UserDocument[];
    invites: InviteDocument[];
    activities: ActivityDocument[];
    networks: NetworkDocument[];
}

interface FetcherData {
    invites: InviteDocument[];
}

export class InvitesView extends React.Component<Props> {

    private skip = 0;
    private fetchedAll = false;

    private filters: {[key: string]: any} = {
        filterByAll: true,
        filterByActivities: false,
        filterByTribes: false,
        filterByPartups: false,
    };

    private defaultQueryVars = {
        limit: 20,
        skip: 0,
        ...this.filters,
    };

    private invitesFetcher = new Fetcher<FetcherResponse, FetcherData>({
        route: 'invites/me',
        query: {
            ...this.defaultQueryVars,
        },
        onChange: () => this.forceUpdate(),
        onResponse: (data) => {
            const {
                'cfs.images.filerecord': images = [],
                invites = [],
                partups = [],
                users = [],
                networks = [],
                activities = [],
            } = data;

            Images.updateStatics(images);
            Invites.updateStatics(invites);
            Partups.updateStatics(partups);
            Users.updateStatics(users);
            Networks.updateStatics(networks);
            Activities.updateStatics(activities);
        },
        transformData: (data) => {
            return {
                invites: data.invites,
            };
        },
    });

    public componentWillMount() {
        this.invitesFetcher.fetch();
    }

    public render() {
        const { data, loading } = this.invitesFetcher;
        const { invites } = data;

        return (
            <ContentView>
                <FilteredList>
                    <FilteredListControls>
                        <Blank label={translate('pur-dashboard-invites-filter_by_type-label')}>
                            <Select options={[
                                {
                                    label: translate('pur-dashboard-invites-filter_by_all'),
                                    value: 'filterByAll',
                                    onChange: this.filterBy('filterByAll'),
                                },
                                {
                                    label: translate('pur-dashboard-invites-filter_by_activities'),
                                    value: 'filterByActivities',
                                    onChange: this.filterBy('filterByActivities'),
                                },
                                {
                                    label: translate('pur-dashboard-invites-filter_by_tribes'),
                                    value: 'filterByTribes',
                                    onChange: this.filterBy('filterByTribes'),
                                },
                                {
                                    label: translate('pur-dashboard-invites-filter_by_partups'),
                                    value: 'filterByPartups',
                                    onChange: this.filterBy('filterByPartups'),
                                },
                            ]} />
                        </Blank>
                    </FilteredListControls>
                    <FilteredListItems>
                        { (loading || !invites) ? (
                            <Spinner />
                        ) : (
                            <InfiniteScroll loadMore={this.loadMore}>
                                {invites.map(invite => (
                                    <InviteTile key={invite._id} invite={invite} />
                                ))}
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

        await this.invitesFetcher.fetchMore({
            skip: this.skip,
            ...this.filters,
        }, mergeDataByKey('invites', () => {
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

        await this.invitesFetcher.fetch({
            skip: this.skip,
            ...this.filters,
        });
    }
}
