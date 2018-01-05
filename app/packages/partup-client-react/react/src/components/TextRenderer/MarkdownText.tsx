import * as React from 'react';
import * as c from 'classnames';
import './MarkdownText.css';
import { HTMLText } from 'components/TextRenderer/HTMLText';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class MarkdownText extends React.Component<Props, {}> {

    public render() {
        const markdownText = this.parseText();

        return (
            <HTMLText
                className={this.getClassNames()}
                html={markdownText} />
        );
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-MarkdownText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .markdown();

        return parsed;
    }
}
