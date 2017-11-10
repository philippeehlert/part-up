import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouteComponentProps, matchPath } from 'react-router';
import { AppContext } from 'App';

import {
    Icon,
    MediaQuery,
    MobileNav,
    DropDown,
    Counter,
} from 'components';

import {
    UserAvatar,
} from 'components/Avatar';

import List, {
    ListItem,
} from 'components/List';

import { Link, MenuLink } from 'components/Router';

interface Props {
    className?: string;
    baseUrl: string;
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
                query={`(min-width: 650px)`}
                renderMatch={this.renderDesktopNavigation}
                renderNoMatch={this.renderMobileNavigation}
            />
        );
    }

    renderMobileNavigation = () => {
        const { user } = this.context;
        const { navigator } = this.props;

        const dropDownOptions = this.getMenuLinks().map((link, index) => {
            const match = matchPath(navigator.location.pathname, {
                path: link.to,
            });

            return {
                isActive: (match && match.isExact) || false,
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
                        <Link to={user ? `/profile/${user._id}` : '#'}>
                            <UserAvatar user={user} />
                        </Link>
                    </ListItem>
                    <ListItem stretch>
                        <DropDown
                            options={dropDownOptions}
                            onChange={({value}) => { navigator.history.push(value); }}
                        />
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
                    <MenuLink
                        target={'_partup'}
                        to={user ? `/profile/${user._id}` : '#'} icon={<UserAvatar small user={user} />}>
                        { user && user.profile.normalized_name }
                    </MenuLink>
                </ListItem>
                { this.getMenuLinks().map((link, index) => {
                    return (
                        <MenuLink
                            key={index}
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
        const { baseUrl } = this.props;

        return [
            {
                to: `${baseUrl}`,
                icon: <Icon name={'message'} />,
                counter: <Counter count={25} />,
                label: `Gesprekken`,
            },
            {
                to: `${baseUrl}/activities`,
                icon: <Icon name={'chart'} />,
                counter: <Counter count={4} />,
                label: `Mijn activiteiten`,
            },
            {
                to: `${baseUrl}/invites`,
                icon: <Icon name={'person-plus'} />,
                counter: <Counter count={5} />,
                label:  `Mijn uitnodigingen`,
            },
            {
                to: `${baseUrl}/recommendations`,
                icon: <Icon name={'globe'} />,
                counter: <Counter count={3} />,
                label:  `Aanbevolen voor jou`,
            },
        ];
    }
}
