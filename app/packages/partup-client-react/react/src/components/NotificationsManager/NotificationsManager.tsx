import './NotificationsManager.css';

import * as React from 'react';
import * as c from 'classnames';

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

    public state: State = {
        notifications: [],
    };

    public componentWillMount() {
        NotificationsDispatcher.subscribe('error', this.onNotification);
        NotificationsDispatcher.subscribe('warn', this.onNotification);
        NotificationsDispatcher.subscribe('success', this.onNotification);
    }

    public componentWillUnmount() {
        NotificationsDispatcher.unsubscribe('error', this.onNotification);
        NotificationsDispatcher.unsubscribe('warn', this.onNotification);
        NotificationsDispatcher.unsubscribe('success', this.onNotification);
    }

    public render() {
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

    private onNotification = (event: NotificationProps) => {
        const { notifications } = this.state;

        notifications.push(event);

        this.setState({
            notifications,
        });
    }

    private closeNotification = (n: number) => {
        const { notifications } = this.state;

        if (notifications) notifications[n] = undefined;

        this.setState({
            notifications,
        });
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-NotificationsManager', className, {

        });
    }

    private getIcon(type: string) {
        if (type === 'error') return <Icon name={'warning'} />;
        if (type === 'warn') return <Icon name={'warning'} />;
        if (type === 'success') return <Icon name={'check'} />;

        return undefined;
    }
}
