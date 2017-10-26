import * as React from 'react';
import * as PropTypes from 'prop-types';

import { AppContext } from 'App'

import {
    UserAvatar,
} from 'components';

import List, {
    ListItem,
} from 'components/List';

import { MenuLink } from 'components';

interface Props {
    className?: string;
    baseUrl: string,
};

export default class SideBar extends React.Component<Props> {
    public context: AppContext;

    static contextTypes = {
        user: PropTypes.object,
    }

    render() {
        const { user } = this.context;
        const { baseUrl } = this.props;

        console.log(user);

        return (
            <List>
                <ListItem>
                    <MenuLink to={user ? `http://localhost:3000/profile/${user._id}` : '#'} icon={<UserAvatar user={user} />}>
                        { user && user.profile.normalized_name }
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink to={`${baseUrl}`} icon={`💬`} counter={`25`}>
                        ConversationsView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink to={`${baseUrl}/activities`} icon={`💬`} counter={`4`}>
                        ActivitiesView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink to={`${baseUrl}/invites`} icon={`💬`} counter={`5`}>
                        InvitesView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink to={`${baseUrl}/recommendations`} icon={`💬`} counter={`3`}>
                        InvitesView
                    </MenuLink>
                </ListItem>
            </List>
        );
    }
}
