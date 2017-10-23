import * as React from 'react';

import {
    View,
} from '../../../../components';

interface Props {
    match: Object;
    location: Object;
    history: Object;
};

export default class ActivitiesView extends React.Component<Props> {

    render() {
        return (
            <View>
                Activities View
            </View>
        );
    }
};
