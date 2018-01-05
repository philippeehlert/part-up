import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    loadMore: (cb: () => void) => void;
}

export class InfiniteScroll extends React.Component<Props, {}> {

    // private static THRESHOLD = window.innerHeight;

    private loadingMore = false;

    private scrollContainer: HTMLDivElement|null;

    public componentDidMount() {
        window.addEventListener('scroll', this.throttleOnScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.throttleOnScroll);
    }

    public render() {
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

        if (fromBottom <= this.scrollContainer.clientHeight / 3.5) {
            this.loadingMore = true;
            this.props.loadMore(() => this.loadingMore = false);
        }
    }

    private throttleOnScroll = () => {
        return requestAnimationFrame(this.onScroll);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-InfiniteScroll', className, {

        });
    }
}
