import * as React from 'react';
import * as c from 'classnames';
import './CommentText.css';
import { HTMLText } from 'components/TextRenderer/HTMLText';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class CommentText extends React.PureComponent<Props, {}> {

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

        return c('pur-CommentText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .mentions()
            .links()
            .emojis();

        return parsed;
    }
}
