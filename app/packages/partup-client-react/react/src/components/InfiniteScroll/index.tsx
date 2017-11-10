import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    loadMore: (cb: () => void) => void;
}

export default class InfiniteScroll extends React.Component<Props, {}> {

    static THRESHOLD = window.innerHeight / 2;

    private loadingMore = false;

    private scrollContainer: HTMLDivElement|null;

    componentDidMount() {
        window.addEventListener('scroll', this.throttleOnScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.throttleOnScroll);
    }

    getClassNames() {
        const { className } = this.props;

        return c('pur-InfiniteScroll', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()} ref={el => this.scrollContainer = el}>
                { children }
            </div>
        );
    }

    private onScroll = () => {

        if (!this.scrollContainer || this.loadingMore) {
            return;
        }

        const fromBottom = (this.scrollContainer.clientHeight + this.scrollContainer.offsetTop) - window.scrollY - window.innerHeight;

        if (fromBottom <= InfiniteScroll.THRESHOLD) {
            this.loadingMore = true;
            this.props.loadMore(() => this.loadingMore = false);
        }
    }

    private throttleOnScroll = () => {
        return requestAnimationFrame(this.onScroll);
    }
}
