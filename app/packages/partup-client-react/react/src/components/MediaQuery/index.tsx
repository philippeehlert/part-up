import * as React from 'react';

interface Props {
    className?: string;
    query: string;
    renderMatch: Function;
    renderNoMatch?: Function;
};

interface State {
    mediaQueryList: MediaQueryList
}

export default class MediaQuery extends React.Component<Props, State> {

    public state: State = {
        mediaQueryList: window.matchMedia(this.props.query)
    }

    componentDidMount() {
        this.updateMediaQueryList();
        window.addEventListener('resize', this.updateMediaQueryList);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateMediaQueryList);
    }

    updateMediaQueryList = () => requestAnimationFrame(() => {
        const { query } = this.props;

        this.setState({mediaQueryList: window.matchMedia(query)});
    });

    render() {
        const { renderMatch, renderNoMatch } = this.props;
        const { mediaQueryList } = this.state;

        if (mediaQueryList.matches) {
            return renderMatch();
        } else if (renderNoMatch) {
            return renderNoMatch();
        }
    }
}
