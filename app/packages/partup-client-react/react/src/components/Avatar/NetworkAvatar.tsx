import './NetworkAvatar.css';

import * as React from 'react';
import * as c from 'classnames';
import { Images } from 'collections/Images';
import { NetworkDocument } from 'collections/Networks';

interface Props {
    className?: string;
    network: NetworkDocument;
}

interface State {}

export class NetworkAvatar extends React.Component<Props, State> {

    public render() {
        const { network } = this.props;

        const imageUrl = Images.getUrl(Images.findOneAny({ _id: network.image }));

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} className={`pur-NetworkAvatar__image`} />
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-NetworkAvatar', {
            // 'pur-NetworkAvatar--modifier-class': boolean,
        }, className);
    }
}
