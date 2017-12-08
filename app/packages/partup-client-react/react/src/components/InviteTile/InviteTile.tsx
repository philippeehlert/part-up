import './InviteTile.css';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import * as moment from 'moment';
import { InviteDocument } from 'collections/Invites';
import { Tile } from 'components/Tile/Tile';
import { translate } from 'utils/translate';
import { Link } from 'components/Router/Link';
import { renderToTranslatableString } from 'utils/renderToTranslatableString';
import { Partups, PartupDocument } from 'collections/Partups';
import { ActivityDocument, Activities } from 'collections/Activities';
import { UserDocument, Users } from 'collections/Users';
import { PartupAvatar } from 'components/Avatar/PartupAvatar';
import { NetworkDocument, Networks } from 'collections/Networks';
import { NetworkAvatar } from 'components/Avatar/NetworkAvatar';
import { AppContext } from 'App';

interface Props {
    className?: string;
    invite: InviteDocument;
}

interface State {}

export class InviteTile extends React.Component<Props, State> {

    public static contextTypes = {
        user: PropTypes.object,
    };

    public context: AppContext;

    private inviter: UserDocument;
    private partup?: PartupDocument;
    private activity?: ActivityDocument;
    private activityPartup?: PartupDocument;
    private network?: NetworkDocument;

    public componentWillMount() {
        const { invite } = this.props;

        this.activity = Activities.findOneAny({ _id: invite.activity_id });
        if (this.activity) {
            this.activityPartup = Partups.findOneAny({ _id: this.activity.partup_id });
        }
        this.partup = Partups.findOneAny({ _id: invite.partup_id });
        this.inviter = Users.findOneAny({ _id: invite.inviter_id }) as UserDocument;
        this.network = Networks.findOneAny({ _id: invite.network_id });
    }

    public render() {
        const isParterOfPartup = this.activity && this.context.user
            ? this.context.user.upperOf.includes(this.activity.partup_id)
            : undefined;

        return (
            <Tile
                title={this.getInviteTileTitle()}
                subTitle={this.activity && isParterOfPartup === false ? translate('pur-dashboard-invites-subtitle-partup') : ''}
            >
                <div className={this.getClassNames()}>
                    {this.partup && (
                        <Link
                            className={`pur-InviteTile__link`}
                            to={`/partups/${Partups.getSlugById(this.partup._id)}`}
                            target={`_partup`}
                        >
                            <PartupAvatar partup={this.partup} />
                            { this.partup.name }
                        </Link>
                    )}
                    {this.network && (
                        <Link
                            className={`pur-InviteTile__link`}
                            to={`/tribes/${Networks.getSlugById(this.network._id)}`}
                            target={`_partup`}
                        >
                            <NetworkAvatar network={this.network} />
                            { this.network.name }
                        </Link>
                    )}
                    {this.activity && (
                        <Link
                            className={`pur-InviteTile__link`}
                            to={`/partups/${Partups.getSlugById(this.activity.partup_id)}/updates/${this.activity.update_id}`}
                            target={`_partup`}
                        >
                            { this.activity.name }
                        </Link>
                    )}
                </div>
            </Tile>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-InviteTile', {
            // 'pur-InviteTile--modifier-class': boolean,
        }, className);
    }

    private getInviteTileTitle() {
        const { invite } = this.props;

        const inviter = renderToTranslatableString(
            <Link to={`/profile/${this.inviter._id}`} target={`_partup`}>
                {this.inviter.profile.name}
            </Link>,
        );

        const date = moment(invite.created_at).format('DD MMMM YYYY');

        if (invite.type === 'partup_existing_upper' && this.partup) {
            return translate('pur-dashboard-invite_tile-title-partup', {
                inviter: inviter,
                date: date,
                partup: renderToTranslatableString(
                    <Link
                        to={`/partups/${Partups.getSlugById(this.partup._id)}`}
                        target={`_partup`}
                    >
                        {this.partup.name}
                    </Link>,
                ),
                interpolation: { escapeValue: false },
            });
        }

        if (invite.type === 'network_existing_upper') {
            return translate('pur-dashboard-invite_tile-title-network', {
                inviter: inviter,
                date: date,
                interpolation: { escapeValue: false },
            });
        }

        if (invite.type === 'activity_existing_upper' && this.activity) {
            return translate('pur-dashboard-invite_tile-title-activity', {
                inviter: inviter,
                date: date,
                partup: renderToTranslatableString(
                    <Link
                        to={`/partups/${Partups.getSlugById(this.activity.partup_id)}`}
                        target={`_partup`}
                    >
                        {this.activityPartup ? this.activityPartup.name : ''}
                    </Link>,
                ),
                interpolation: { escapeValue: false },
            });
        }
    }
}
