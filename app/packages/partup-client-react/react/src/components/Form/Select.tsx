import * as React from 'react';
import * as c from 'classnames';
import './Select.css';

interface Props {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue?: any;
    options: {
        label: JSX.Element|string,
        value?: string | number | string[],
        selected?: boolean,
        onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    }[];
}

export default class Select extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Select', className, {

        });
    }

    render() {
        const {
            options,
            defaultValue,
        } = this.props;

        return (
            <select className={this.getClassNames()} onChange={this.onChange} defaultValue={defaultValue}>
                { options.map((option, index) => (
                    <option key={index} selected={option.selected} value={option.value}>{option.label}</option>
                )) }
            </select>
        );
    }

    private onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options, onChange } = this.props;
        const selectedValue = event.currentTarget.value;

        const selectedOption =
            options.find(({value}) => value === selectedValue) || options[selectedValue];

        if (selectedOption && selectedOption.onChange) {
            selectedOption.onChange(event);
        }

        if (onChange) onChange(event);
    }
}
