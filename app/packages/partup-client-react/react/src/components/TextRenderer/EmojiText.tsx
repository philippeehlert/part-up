import * as React from 'react';
import * as c from 'classnames';
import './EmojiText.css';
import { TextParser } from 'components/TextRenderer/parse';

interface Props {
    className?: string;
    text: string;
}

export class EmojiText extends React.Component<Props, {}> {

    public render() {
        const emojiText = this.parseText();

        return (
            <div className={this.getClassNames()}>
                {emojiText}
            </div>
        );
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-EmojiText', className, {

        });
    }

    private parseText = () => {
        const { text } = this.props;

        const { parsed } = new TextParser({ text })
            .emojis();

        return parsed;
    }
}
