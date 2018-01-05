import './PartupAvatar.css';

import * as React from 'react';
import * as c from 'classnames';
import { PartupDocument } from 'collections/Partups';
import { Images } from 'collections/Images';

interface Props {
    className?: string;
    partup: PartupDocument;
}

interface State {}

export class PartupAvatar extends React.Component<Props, State> {

    public render() {
        const { partup } = this.props;

        const imageUrl = Images.getUrl(Images.findOneAny({ _id: partup.image }));

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} className={`pur-PartupAvatar__image`} />
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupAvatar', {
            // 'pur-PartupAvatar--modifier-class': boolean,
        }, className);
    }
}
