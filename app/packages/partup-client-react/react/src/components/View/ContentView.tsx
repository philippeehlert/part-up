import './ContentView.css';

import * as React from 'react';
import * as c from 'classnames';

import { View } from './View';

interface Props {
    className?: string;
}

export class ContentView extends React.Component<Props, {}> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <View className={this.getClassNames()}>
                { children }
            </View>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContentView', className, {

        });
    }
}
