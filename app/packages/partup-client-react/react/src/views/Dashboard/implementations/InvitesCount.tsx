import * as React from 'react';
import * as c from 'classnames';
import { Counter } from 'components/Counter/Counter';
import { Subscriber } from 'utils/Subscriber';
import { UpdateDocument } from 'collections/Updates';
import { Tracker } from 'utils/Tracker';
import { Users } from 'collections/Users';
import { Invites } from 'collections/Invites';

interface Props {
    className?: string;
}

interface State {
    count: number;
}

export class InvitesCount extends React.PureComponent<Props, State> {

    public state: State = {
        count: 0,
    };

    private newInvitesSubscriber = new Subscriber({
        subscription: 'invites.new_invites_count',
    });

    private updateTracker = new Tracker<UpdateDocument>({
        collection: 'invites',
        onChange: (event) => {
            const { state: { ready } } = this.newInvitesSubscriber;

            if (!ready) return;

            const user = Users.findLoggedInUser();

            if (!user) {
                return;
            }

            const count = Invites.find({
                invitee_id: user._id,
            }).length;

            this.setState({
                count: count,
            });
        },
    });

    public componentWillMount() {
        this.newInvitesSubscriber.subscribe({ dateFrom: new Date() });
    }

    public componentWillUnmount() {
        this.newInvitesSubscriber.destroy();
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
