import * as React from 'react';
import * as c from 'classnames';
import './ContentView.css';

import { View } from './View';

interface Props {
    className?: string;
}

export class ContentView extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContentView', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <View className={this.getClassNames()}>
                { children }
            </View>
        );
    }
}
