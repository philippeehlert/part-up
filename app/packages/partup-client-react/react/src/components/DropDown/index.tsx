import * as React from 'react';
import * as c from 'classnames';
import './DropDown.css';

import { Icon } from '../';

type DropDownItem = {
    isActive: boolean,
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
        activeIndex: this.props.options.findIndex(({isActive}) => isActive) || 0,
    };

    render() {
        const { options } = this.props;
        const { activeIndex, isExpanded } = this.state;

        const activeItem = options[activeIndex];

        return (
            <div className={this.getClassNames()}>

                <button
                    type={`button`}
                    className={`pur-DropDown__button-control`}
                    onClick={this.toggleExpanded}
                >
                    { activeItem.leftChild && (
                        <span className={`pur-DropDown__button-control__leftChild`}>{ activeItem.leftChild }</span>
                    ) }

                    <span className={`pur-DropDown__button-control__label`}>{activeItem.label}</span>

                    <span className={`pur-DropDown__button-control__caret`}><Icon name={`caret-slim-down`} /></span>
                </button>

                { isExpanded && (
                    <ul className={`pur-DropDown__items`}>
                        { options.map((item, index) => {
                            return (
                                <li key={index} className={`pur-DropDown__item`} onClick={() => this.handleItemClick(index)}>
                                    { item.leftChild && (
                                        <span className={`pur-DropDown__item__leftChild`}>{ item.leftChild }</span>
                                    ) }

                                    <span className={`pur-DropDown__item__label`}>{item.label}</span>

                                    { item.rightChild && (
                                        <span className={`pur-DropDown__item__rightChild`}>{ item.rightChild }</span>
                                    ) }
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

    private getClassNames() {
        const { className } = this.props;
        const { isExpanded } = this.state;

        return c('pur-DropDown', className, {
            'pur-DropDown--is-expanded': isExpanded,
        });
    }
}
