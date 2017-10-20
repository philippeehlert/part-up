import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../../../components';

export default class InvitesView extends Component {

    static propTypes = {
        match: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
    };

    static defaultProps = {

    };

    render() {
        return (
            <View>
                Invites View
            </View>
        );
    }
};
