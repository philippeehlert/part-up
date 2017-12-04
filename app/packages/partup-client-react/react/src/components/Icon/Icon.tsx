import './Icon.css';

import * as React from 'react';
import * as c from 'classnames';

import * as icons from 'static/icons.json';

interface Props {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    name: IconName;
}

type IconName =
      'archive'
    | 'arrow-down'
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-up'
    | 'bell'
    | 'calendar-check'
    | 'caret-down'
    | 'caret-left'
    | 'caret-right'
    | 'caret-slim-down'
    | 'caret-slim-left'
    | 'caret-slim-right'
    | 'caret-slim-up'
    | 'caret-up'
    | 'chart'
    | 'chat'
    | 'check'
    | 'checkbox'
    | 'cog'
    | 'crossroad'
    | 'documents'
    | 'download'
    | 'drive'
    | 'dropbox'
    | 'facebook'
    | 'globe'
    | 'info-outline'
    | 'info'
    | 'instagram'
    | 'linkedin'
    | 'location'
    | 'lock-closed'
    | 'lock-open'
    | 'megaphone'
    | 'message'
    | 'menu'
    | 'monitor'
    | 'monkeytail'
    | 'network'
    | 'pencil'
    | 'person-plus'
    | 'photo'
    | 'plus'
    | 'profile-card'
    | 'question'
    | 'recommended'
    | 'search'
    | 'share'
    | 'show'
    | 'times'
    | 'twitter'
    | 'unarchive'
    | 'upload'
    | 'video'
    | 'warning';

export class Icon extends React.Component<Props, {}> {

    public render() {
        const { name } = this.props;

        return (
            <i
            className={this.getClassNames()}
            onClick={this.onClick}
            dangerouslySetInnerHTML={{ __html: icons[name] }} />
        );
    }

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Icon', className, {

        });
    }
}
