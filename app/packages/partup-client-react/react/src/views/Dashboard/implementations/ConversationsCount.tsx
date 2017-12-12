import * as React from 'react';
import * as c from 'classnames';
import { Counter } from 'components/Counter/Counter';
import { Subscriber } from 'utils/Subscriber';
import { UpdateDocument } from 'collections/Updates';
import { Tracker } from 'utils/Tracker';
// import { Meteor } from 'utils/Meteor';
// import { Partups } from 'collections/Partups';
// import { Meteor } from 'utils/Meteor';
import { Partups } from 'collections/Partups';

interface Props {
    className?: string;
}

interface State {
    count: number;
}

export class ConversationsCount extends React.PureComponent<Props, State> {

    public state: State = {
        count: 0,
    };

    private newConversationsSubscriber = new Subscriber({
        subscription: 'updates.new_conversations_count',
    });

    private updateTracker = new Tracker<UpdateDocument>({
        collection: 'partups',
        onChange: (event) => {
            const { state: { ready } } = this.newConversationsSubscriber;

            if (!ready) return;

            const userId = 'pbnjsmy75oDNP3vok';

            const partups = Partups.find({
                upper_data: {
                    $elemMatch: {
                        _id: userId,
                        new_updates: { $exists: true, $not: { $size: 0 } },
                    },
                },
            });

            const updateIds = new Set(
                partups.map(({ upper_data }) => {
                    const upperData = upper_data.find(({ _id }) => _id === userId);

                    return upperData ? upperData.new_updates : [];
                }).reduce((x, y) => x.concat(y), []),
            );

            this.setState({
                count: updateIds.size,
            });
        },
    });

    public componentWillMount() {
        this.newConversationsSubscriber.subscribe({ dateFrom: new Date() });
    }

    public componentWillUnmount() {
        this.newConversationsSubscriber.destroy();
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
