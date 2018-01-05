import * as React from 'react';
import * as c from 'classnames';
import { Counter } from 'components/Counter/Counter';
import { Subscriber } from 'utils/Subscriber';
import { UpdateDocument, Updates } from 'collections/Updates';
import { Tracker } from 'utils/Tracker';
import { Users } from 'collections/Users';
import { Partups } from 'collections/Partups';

interface Props {
    className?: string;
}

interface State {
    count: number;
}

export class ActivitiesCount extends React.PureComponent<Props, State> {

    public state: State = {
        count: 0,
    };

    private newActivitiesSubscriber = new Subscriber({
        subscription: 'activities.updated_activities',
    });

    private updateTracker = new Tracker<UpdateDocument>({
        collection: 'partups',
        onChange: (event) => {
            const { state: { ready } } = this.newActivitiesSubscriber;

            if (!ready) return;

            const user = Users.findLoggedInUser();

            if (!user) {
                return;
            }

            const partups = Partups.find({
                upper_data: {
                    $elemMatch: {
                        _id: user._id,
                        new_updates: { $exists: true, $not: { $size: 0 } },
                    },
                },
            });

            const updateIds = new Set(
                partups.map(({ upper_data }) => {
                    const upperData = upper_data.find(({ _id }) => _id === user._id);

                    return upperData ? upperData.new_updates : [];
                }).reduce((x, y) => x.concat(y), []),
            );

            const updates = Updates.find({
                _id: { $in: Array.from(updateIds) },
                type: 'partups_contributions_added',
            });

            this.setState({
                count: updates.length,
            });
        },
    });

    public componentWillMount() {
        this.newActivitiesSubscriber.subscribe({ dateFrom: new Date() });
    }

    public componentWillUnmount() {
        this.newActivitiesSubscriber.destroy();
        this.updateTracker.destroy();
    }

    public render() {
        const { count } = this.state;

        return (
            <Counter className={this.getClassNames()} count={count} />
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ConversationsCount', {
            // 'pur-ConversationsCount--modifier-class': boolean,
        }, className);
    }
}
