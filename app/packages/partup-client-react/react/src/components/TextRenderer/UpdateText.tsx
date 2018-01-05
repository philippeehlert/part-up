import * as React from 'react';
import * as c from 'classnames';
import './UpdateText.css';
import { HTMLText } from 'components/TextRenderer/HTMLText';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class UpdateText extends React.Component<Props, {}> {

    public render() {
        const text = this.parseText();

        return (
            <HTMLText
                className={this.getClassNames()}
                html={text} />
        );
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-UpdateText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .mentions()
            .markdown()
            .links()
            .emojis()
            .html();

        return parsed;
    }
}
