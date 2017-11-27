import * as React from 'react';
import * as c from 'classnames';
import './NotificationsManager.css';

import { Portal } from 'components/PortalManager/Portal';
import { Icon } from 'components/Icon/Icon';
import { Notification, NotificationProps } from './Notification';

import { NotificationsDispatcher } from 'utils/notify';

interface Props {
    className?: string;
}

interface State {
    notifications: Array<NotificationProps| undefined>;
}

export class NotificationsManager extends React.Component<Props, State> {

    static defaultProps = {

    };

    state: State = {
        notifications: [],
    };

    componentWillMount() {
        NotificationsDispatcher.subscribe('error', this.onNotification);
        NotificationsDispatcher.subscribe('warn', this.onNotification);
        NotificationsDispatcher.subscribe('success', this.onNotification);
    }

    componentWillUnmount() {
        NotificationsDispatcher.unsubscribe('error', this.onNotification);
        NotificationsDispatcher.unsubscribe('warn', this.onNotification);
        NotificationsDispatcher.unsubscribe('success', this.onNotification);
    }

    onNotification = (event: NotificationProps) => {
        const { notifications } = this.state;

        notifications.push(event);

        this.setState({
            notifications,
        });
    }

    closeNotification = (n: number) => {
        const { notifications } = this.state;

        if (notifications) notifications[n] = undefined;

        this.setState({
            notifications,
        });
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-NotificationsManager', className, {

        });
    }

    getIcon = (type: string) => {
        if (type === 'error') return <Icon name={'warning'} />;
        if (type === 'warn') return <Icon name={'warning'} />;
        if (type === 'success') return <Icon name={'check'} />;

        return undefined;
    }

    render() {
        const { notifications = [] } = this.state;

        return (
            <Portal className={this.getClassNames()}>
                { notifications.map((notification: NotificationProps, index) => (
                    notification && (
                        <Notification
                            key={index}
                            index={index}
                            onClose={(n: number) => this.closeNotification(n)}
                            title={notification.title}
                            content={notification.content}
                            icon={this.getIcon(notification.type)}
                            type={notification.type}
                        />
                    )
                )).filter((n) => !!n) }
            </Portal>
        );
    }
}
