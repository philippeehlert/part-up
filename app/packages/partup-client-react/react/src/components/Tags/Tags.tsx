import './Tags.css';

import * as React from 'react';
import * as c from 'classnames';
import { Tag } from 'components/Tags/Tag';

interface Props {
    className?: string;
    tags: string[];
}

interface State {}

export class Tags extends React.Component<Props, State> {

    public render() {
        const {
            tags,
        } = this.props;

        return (
            <ul className={this.getClassNames()}>
                {tags.map(tag => <li key={tag} className={`pur-Tags__tag`}><Tag>{tag}</Tag></li>)}
            </ul>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Tags', {
            // 'pur-Tags--modifier-class': boolean,
        }, className);
    }
}
