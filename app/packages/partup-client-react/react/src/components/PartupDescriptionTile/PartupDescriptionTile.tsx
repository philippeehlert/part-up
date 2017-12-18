import './PartupDescriptionTile.css';

import * as React from 'react';
import * as c from 'classnames';
import { PartupDocument } from 'collections/Partups';
import { Users, UserDocument } from 'collections/Users';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { Tags } from 'components/Tags/Tags';
import { translate } from 'utils/translate';

interface Props {
    className?: string;
    partup: PartupDocument;
}

interface State {
    founder: UserDocument;
}

export class PartupDescriptionTile extends React.Component<Props, State> {

    public componentWillMount() {
        const { partup } = this.props;
        const founder = Users.findOneStatic({ _id: partup.creator_id });

        this.setState({
            founder: founder as UserDocument,
        });
    }

    public render() {
        const { partup } = this.props;
        const { founder } = this.state;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-PartupDescriptionTile__description`}>
                    <h6 className={`pur-PartupDescriptionTile__description-title`}>
                        {translate('pur-partup-start-description_tile-challenge')}
                    </h6>
                    <p className={`pur-PartupDescriptionTile__description-text`}>{ partup.description }</p>
                    {partup.expected_result && (
                        <React.Fragment>
                            <h6 className={`pur-PartupDescriptionTile__description-title`}>
                                {translate('pur-partup-start-description_tile-expected_result')}
                            </h6>
                            <p className={`pur-PartupDescriptionTile__description-text`}>{ partup.expected_result }</p>
                        </React.Fragment>
                    )}
                    <Tags className={`pur-PartupDescriptionTile__tags`} tags={partup.tags}/>
                </div>
                <div className={`pur-PartupDescriptionTile__founder-text`}>
                    <div>
                        <p className={`pur-PartupDescriptionTile__founder-motivation`}>
                            {
                                partup.motivation
                                    ? partup.motivation
                                    : translate('pur-partup-start-description_tile-motivation_placeholder')
                            }
                        </p>
                        <div className={`pur-PartupDescriptionTile__founder`}>
                            <UserAvatar user={founder} small />
                            <div className={`pur-PartupDescriptionTile__founder-info`}>
                                <p className={`pur-PartupDescriptionTile__founder-name`}>{founder.profile.name}</p>
                                <p className={`pur-PartupDescriptionTile__founder-subtext`}>
                                    {translate('pur-partup-start-description_tile-motivation_text')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupDescriptionTile', {
            // 'pur-PartupDescriptionTile--modifier-class': boolean,
        }, className);
    }
}
