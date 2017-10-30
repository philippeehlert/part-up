import * as React from 'react';
import * as c from 'classnames';
import { default as ReactSelect } from 'react-select';
import 'react-select/dist/react-select.css';
import './Select.css';

interface Props {
    className?: string;
    name?: string;
    options: Array<{
        label: any;
        value: any;
    }>;
}

export default class Select extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Select', className, {

        });
    }

    render() {
        const { options, name } = this.props;

        return (
            <ReactSelect
                options={options}
                value={'ConversationsView'}
                name={name}
                className={this.getClassNames()}
            />
        );
    }
}
