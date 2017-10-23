import * as React from 'react';
import * as c from 'classnames';
import './SideBarView.css';

interface Props {
    className?: string;
    sidebar: any;
};

export default class SideBarView extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-SideBarView', className, {

        });
    };

    render() {
        const { children, sidebar } = this.props;

        return (
            <div className={this.getClassNames()}>
                <div className={'pur-SideBarView__sidebar'}>
                    { sidebar }
                </div>
                <div className={'pur-SideBarView__content'}>
                    { children }
                </div>
            </div>
        );
    };
};
