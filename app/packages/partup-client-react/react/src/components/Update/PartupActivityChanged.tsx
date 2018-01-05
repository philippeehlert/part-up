import './PartupActivityChanged.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import { Activity } from 'components/Activity/Activity';
import { UpdateDocument } from 'collections/Updates';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Documents } from 'components/Documents/Documents';
import { Activities } from 'collections/Activities';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class PartupActivityChanged extends React.Component<Props, {}> {

    public render() {
        const { data } = this.props;

        const activity = Activities.findOneStatic({ _id: get(data, 'type_data.activity_id') });
        const documents = get(activity, 'files.documents');
        const images = get(activity, 'files.images');

        return (
            <div className={this.getClassNames()}>
                <Activity _id={get(data, 'type_data.activity_id')} />
                {images && <ImageGallery images={images} />}
                {documents && <Documents documents={documents} />}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityChanged', className, {

        });
    }
}
