import * as React from 'react';
import * as c from 'classnames';
import './LinkText.css';
import { HTMLText } from 'components/TextRenderer/HTMLText';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class LinkText extends React.PureComponent<Props, {}> {

    public render() {
        const linkedText = this.parseText();

        return (
            <HTMLText
                className={this.getClassNames()}
                html={linkedText} />
        );
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-LinkText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .links();

        return parsed;
    }
}
