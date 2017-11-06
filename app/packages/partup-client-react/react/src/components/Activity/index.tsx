import * as React from 'react';
import * as c from 'classnames';
import './Activity.css';

interface Props {
    className?: string;
    _id: string;
}

export default class Activity extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Activity', className, {

        });
    }

    render() {
        const { _id } = this.props;

        return (
            <div className={this.getClassNames()}>
                {`Render activity: ${_id}`}
            </div>
        );
    }
}
