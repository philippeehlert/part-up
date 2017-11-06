
import * as React from 'react';
import * as c from 'classnames';
import './PartupImageChanged.css';
import { get } from 'lodash';
import { Icon } from 'components';

import Images from 'collections/Images';

interface Props {
    className?: string;
    data: any;
}

export default class PartupImageChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupImageChanged', className, {

        });
    }

    render() {
        console.log(this.props.data);
        const { data } = this.props;
        const newImageId = get(data, 'type_data.new_image');
        const oldImageId = get(data, 'type_data.old_image');

        const newImage = Images.findOne({_id: newImageId}) || Images.findOneStatic(newImageId);
        const oldImage = Images.findOne({_id: oldImageId}) || Images.findOneStatic(oldImageId);
        const newImageUrl = Images.getUrl(newImage);
        const oldImageUrl = Images.getUrl(oldImage);

        return (
            <div className={this.getClassNames()}>
                <img className={`pur-PartupImageChanged__image`} src={newImageUrl} alt={'partup-image'}/>
                <Icon className={'pur-PartupImageChanged__icon'} name={'arrow-left'} />
                <img className={`pur-PartupImageChanged__image`} src={oldImageUrl} alt={'partup-image'}/>
            </div>
        );
    }
}
