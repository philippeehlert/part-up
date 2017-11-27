
import * as React from 'react';
import * as c from 'classnames';
import './PartupMessageAdded.css';
import translate from 'utils/translate';
import { get } from 'lodash';
import { HTMLText } from 'components/HTMLText/HTMLText';
import { decode } from 'utils/mentions';

interface Props {
    className?: string;
    data: any;
}

export class PartupMessageAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupMessageAdded', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { this.renderContent() }
            </div>
        );
    }

    private renderContent = () => {
        const { type_data } = this.props.data;

        if (type_data.type === 'welcome_message') {
            return translate('update-type-partups_message_added-system-welcome_message-content');
        }

        return <HTMLText html={decode(get(type_data, 'new_value'))} />;
    }
}
