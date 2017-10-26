import * as React from 'react';
import * as PropTypes from 'prop-types';

import { AppContext } from 'App'

import {
    UserAvatar,
    Icon,
    MediaQuery,
    MobileNav,
} from 'components';

import List, {
    ListItem,
} from 'components/List';

import { MenuLink } from 'components';

import { Link } from 'components/Router';

interface Props {
    className?: string;
    baseUrl: string,
    currentRoute: string,
};

export default class SideBar extends React.Component<Props> {

    static contextTypes = {
        user: PropTypes.object,
    };

    public context: AppContext;

    render() {
        return (
            <MediaQuery
                query={`(min-width: 420px)`}
                renderMatch={this.renderDesktopNavigation}
                renderNoMatch={this.renderMobileNavigation}
            />
        );
    }

    renderMobileNavigation = () => {
        const { user } = this.context;

        return (
            <MobileNav>
                <List horizontal>
                    <ListItem>
                        <Link to={user ? `http://localhost:3000/profile/${user._id}` : '#'}>
                            <UserAvatar user={user} />
                        </Link>
                    </ListItem>
                    <ListItem stretch>
                        <select>
                            <option>ConversationsView</option>
                            <option>ActivitiesView</option>
                            <option>InvitesView</option>
                            <option>InvitesView</option>
                        </select>
                    </ListItem>
                </List>
            </MobileNav>
        );
    }

    renderDesktopNavigation = () => {
        const { user } = this.context;
        const { baseUrl, currentRoute } = this.props;

        return (
            <List>
                <ListItem>
                    <MenuLink to={user ? `http://localhost:3000/profile/${user._id}` : '#'} icon={<UserAvatar small user={user} />}>
                        { user && user.profile.normalized_name }
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink isActive={currentRoute === `${baseUrl}`} to={`${baseUrl}`} icon={<Icon name={'message'} />} counter={`25`}>
                        ConversationsView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink isActive={currentRoute === `${baseUrl}/activities`} to={`${baseUrl}/activities`} icon={<Icon name={'chart'} />} counter={`4`}>

                        ActivitiesView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink isActive={currentRoute === `${baseUrl}/invites`} to={`${baseUrl}/invites`} icon={<Icon name={'person-plus'} />} counter={`5`}>
                        InvitesView
                    </MenuLink>
                </ListItem>
                <ListItem>
                    <MenuLink isActive={currentRoute === `${baseUrl}/recommendations`} to={`${baseUrl}/recommendations`} icon={<Icon name={'globe'} />} counter={`3`}>

                        InvitesView
                    </MenuLink>
                </ListItem>
            </List>
        )
    }
}
