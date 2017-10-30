import * as React from 'react';
import * as c from 'classnames';
import './DropDown.css';

type DropDownItem = {
    label: JSX.Element|Element|string,
    value: string,
    leftChild: JSX.Element|Element|string|number,
    rightChild: JSX.Element|Element|string|number,
};

interface Props {
    className?: string;
    options: Array<DropDownItem>;
    onChange?: (changedItem: DropDownItem) => void;
}

interface State {
    isExpanded: boolean;
    activeIndex: number;
}

export default class DropDown extends React.Component<Props, State> {

    static defaultProps = {
        onChange: () => {},
    };

    public state: State = {
        isExpanded: false,
        activeIndex: 0,
    };

    render() {
        const { options } = this.props;
        const { activeIndex, isExpanded } = this.state;

        return (
            <div className={this.getClassNames()}>

                <button
                    type={`button`}
                    className={`pur-DropDown__button-control`}
                    onClick={this.toggleExpanded}
                >
                    { this.renderItem(options[activeIndex]) }
                </button>

                { isExpanded && (
                    <ul className={`pur-DropDown__items`}>
                        { options.map((option, index) => {
                            return (
                                <li key={index} className={`pur-DropDown__item`} onClick={() => this.handleItemClick(index)}>
                                    { this.renderItem(option) }
                                </li>
                            );
                        }) }
                    </ul>
                ) }
            </div>
        );
    }

    private handleItemClick = (itemIndex: number) => {
        const { options, onChange } = this.props;

        const changedItem = options[itemIndex];

        this.setState({
            activeIndex: itemIndex,
            isExpanded: false,
        });

        if (onChange) {
            onChange(changedItem);
        }
    }

    private toggleExpanded = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        this.setState({ isExpanded: ! this.state.isExpanded });
    }

    private renderItem(item: DropDownItem) {
        return (
            <div>
                { item.leftChild && (
                    <span className={`pur-DropDown__item__leftChild`}>{ item.leftChild }</span>
                ) }

                <span className={`pur-DropDown__item__label`}>{item.label}</span>

                { item.rightChild && (
                    <span className={`pur-DropDown__item__rightChild`}>{ item.rightChild }</span>
                ) }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;
        const { isExpanded } = this.state;

        return c('pur-DropDown', className, {
            'pur-DropDown--is-expanded': isExpanded,
        });
    }
}
