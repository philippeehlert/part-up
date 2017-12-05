import * as React from 'react';
import * as c from 'classnames';
import './MentionText.css';
import { HTMLText } from 'components/TextRenderer/HTMLText';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class MentionText extends React.PureComponent<Props, {}> {

    public render() {
        const mentionText = this.parseText();

        return (
            <HTMLText
                className={this.getClassNames()}
                html={mentionText} />
        );
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-MentionText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .markdown();

        return parsed;
    }
}
