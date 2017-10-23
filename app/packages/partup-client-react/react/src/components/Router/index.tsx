import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import * as $ from 'jquery';
import './Router.css';

interface Props {
    className?: string;
    onBackRoute?: (event:Object) => void;
};

export default class Router extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    componentWillMount() {
        $(window).on('popstate', this.onBackRoute);
    };

    componentWillUnmount() {
        $(window).off('popstate', this.onBackRoute);
    };

    onBackRoute = (event: Object) => {
        const { onBackRoute } = this.props;
        const { router } = this.context;

        router.history.goBack();

        if (onBackRoute) onBackRoute(event);
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Router', className, {

        });
    };

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
};

export { default as Link } from './Link';
