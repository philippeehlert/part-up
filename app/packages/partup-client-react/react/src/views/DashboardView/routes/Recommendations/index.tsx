import * as React from 'react';

import {
    View,
} from '../../../../components';

interface Props {
    match: Object;
    location: Object;
    history: Object;
};

export default class RecommendationsView extends React.Component<Props> {

    render() {
        return (
            <View>
                Recommendations View
            </View>
        );
    }
};
