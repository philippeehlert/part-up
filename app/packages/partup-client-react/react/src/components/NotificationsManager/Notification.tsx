import './Notification.css';

import * as React from 'react';
import * as c from 'classnames';

export interface NotificationProps {
    title: string;
    content: string;
    icon?: JSX.Element;
    type: 'error'|'warn'|'success';
}

interface Props extends NotificationProps {
    className?: string;
    onClose: Function;
    index: number;
    onMouseOver?: Function;
    onMouseLeave?: Function;
}

interface State {
    active: boolean;
}

export class Notification extends React.Component<Props, State> {

    public state: State = {
        active: false,
    };

    private timeout: any = undefined;

    public componentDidMount() {
        const { title } = this.props;
        this.start(title.length * 500);
    }

    public render() {
        const { title, icon, content } = this.props;

        return (
            <div className={this.getClassNames()} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                { icon && (
                    <div className={'pur-Notification__icon'}>
                        { icon }
                    </div>
                ) }
                <div className={'pur-Notification__wrapper'}>
                    <span className={'pur-Notification__wrapper__title'}>
                        {title}
                    </span>
                    <span className={'pur-Notification__wrapper__content'}>
                        {content}
                    </span>
                </div>
            </div>
        );
    }

    private start(time: number) {
        setTimeout(() => {
            this.setState({ active: true });
        }, 200);

        this.timeout = setTimeout(() => {
            this.end();
        }, time);
    }

    private end() {
        const { onClose, index } = this.props;

        this.setState({ active: false });
        setTimeout(() => {
            if (onClose) onClose(index);
        }, 200);

    }

    private onMouseOver = (event: React.SyntheticEvent<any>) => {
        const { onMouseOver } = this.props;

        clearTimeout(this.timeout);

        if (onMouseOver) onMouseOver(event);
    }

    private onMouseLeave = (event: React.SyntheticEvent<any>) => {
        const { onMouseLeave } = this.props;

        this.start(1000);

        if (onMouseLeave) onMouseLeave(event);
    }

    private getClassNames() {
        const { className, type } = this.props;
        const { active } = this.state;

        return c('pur-Notification', className, {
            'pur-Notification--error': type === 'error',
            'pur-Notification--warn': type === 'warn',
            'pur-Notification--success': type === 'success',
            'pur-Notification--active': active,
        });
    }
}
