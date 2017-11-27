import './SideBarView.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    sidebar: JSX.Element;
}

export class SideBarView extends React.Component<Props, {}> {

    public render() {
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
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-SideBarView', className, {

        });
    }
}
