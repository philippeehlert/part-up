import * as React from 'react';
import * as c from 'classnames';
import './Notification.css';

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

export default class Notification extends React.Component<Props, State> {

    static defaultProps = {
        
    };
    
    state = {
        active: false,
    };

    private timeout: any = undefined;
    
    componentDidMount() {
        const { title } = this.props;
        this.start(title.length * 500);
    }
    
    start = (time: number) => {
        setTimeout(() => {
            this.setState({active: true});
        }, 200);

        this.timeout = setTimeout(() => {
            this.end();
        }, time);
    }

    end = () => {
        const { onClose, index } = this.props;

        this.setState({active: false});
        setTimeout(() => {
            if (onClose) onClose(index);
        }, 200);

    }
    
    onMouseOver = (event: React.SyntheticEvent<any>) => {
        const { onMouseOver } = this.props;
        
        clearTimeout(this.timeout);
        
        if (onMouseOver) onMouseOver(event);
    }

    onMouseLeave = (event: React.SyntheticEvent<any>) => {
        const { onMouseLeave } = this.props;

        this.start(1000);
    
        if (onMouseLeave) onMouseLeave(event);
    }
    
    getClassNames = () => {
        const { className, type } = this.props;
        const { active } = this.state;
        
        return c('pur-Notification', className, {
            'pur-Notification--error': type === 'error',
            'pur-Notification--warn': type === 'warn',
            'pur-Notification--success': type === 'success',
            'pur-Notification--active': active,
        });
    }
    
    render() {
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

}
