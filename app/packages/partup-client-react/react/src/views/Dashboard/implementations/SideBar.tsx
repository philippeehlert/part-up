import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router';
import { AppContext } from 'App';

import {
    UserAvatar,
    Icon,
    MediaQuery,
    MobileNav,
    DropDown,
} from 'components';

import List, {
    ListItem,
} from 'components/List';

import { Link, MenuLink } from 'components/Router';

interface Props {
    className?: string;
    baseUrl: string;
    currentRoute: string;
    navigator: RouteComponentProps<any>;

}

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
        const { navigator } = this.props;

        const dropDownOptions = this.getMenuLinks().map((link, index) => {
            return {
                leftChild: link.icon,
                rightChild: link.counter,
                label: link.label,
                value: link.to,
            };
        });

        return (
            <MobileNav>
                <List horizontal>
                    <ListItem>
                        <Link to={user ? `http://localhost:3000/profile/${user._id}` : '#'}>
                            <UserAvatar user={user} />
                        </Link>
                    </ListItem>
                    <ListItem stretch>
                        <DropDown options={dropDownOptions} onChange={({value}) => { navigator.history.push(value); }} />
                    </ListItem>
                </List>
            </MobileNav>
        );
    }

    renderDesktopNavigation = () => {
        const { user } = this.context;

        return (
            <List>
                <ListItem>
                    <MenuLink to={user ? `http://localhost:3000/profile/${user._id}` : '#'} icon={<UserAvatar small user={user} />}>
                        { user && user.profile.normalized_name }
                    </MenuLink>
                </ListItem>
                { this.getMenuLinks().map((link, index) => {
                    return (
                        <MenuLink
                            key={index}
                            isActive={link.isActive}
                            to={link.to}
                            icon={link.icon}
                            counter={link.counter}
                        >
                            {link.label}
                        </MenuLink>
                    );
                }) }
            </List>
        );
    }

    /**
     * Returns the menu links used in the sidebar.
     */
    private getMenuLinks() {
        const { baseUrl, currentRoute } = this.props;

        return [
            {
                isActive: currentRoute === `${baseUrl}`,
                to: `${baseUrl}`,
                icon: <Icon name={'message'} />,
                counter: `25`,
                label: `Gesprekken`,
            },
            {
                isActive: currentRoute === `${baseUrl}/activities`,
                to: `${baseUrl}/activities`,
                icon: <Icon name={'chart'} />,
                counter: `4`,
                label: `Mijn activiteiten`,
            },
            {
                isActive: currentRoute === `${baseUrl}/invites`,
                to: `${baseUrl}/invites`,
                icon: <Icon name={'person-plus'} />,
                counter: `5`,
                label:  `Mijn uitnodigingen`,
            },
            {
                isActive: currentRoute === `${baseUrl}/recommendations`,
                to: `${baseUrl}/recommendations`,
                icon: <Icon name={'globe'} />,
                counter: `3`,
                label:  `Aanbevolen voor jou`,
            },
        ];
    }
}
