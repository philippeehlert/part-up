import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import './Link.css';

interface Props {
    className?: string;
    children?: any;
    // onClick?: Function;
    to?: any;
    leftChild?: any;
    rightChild?: any;
}

export default class Link extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Link', className, {

        });
    }

    render() {
        const {
            leftChild,
            children,
            rightChild,
            to,
        } = this.props;

        return (
            <RouterLink to={to} className={this.getClassNames()}>
                { leftChild && (
                    <span className={`pur-Link__left-child`}>
                        { leftChild }
                    </span>
                ) }
                { children && (
                    <span className={`pur-Link__content`}>
                        { children }
                    </span>
                ) }
                { rightChild && (
                    <span className={`pur-Link__right-child`}>
                        { rightChild }
                    </span>
                ) }
            </RouterLink>
        );
    }
}
