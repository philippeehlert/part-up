import './CommentBox.css';

import * as React from 'react';
import * as c from 'classnames';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { Input } from 'components/Form/Input';
import { Button } from 'components/Button/Button';
import { Form } from 'components/Form/Form';

interface Props {
    className?: string
    onSubmit: (e: any, fields: any) => void
    poster: any
}

interface State {
    showSendButton: boolean
}

export class CommentBox extends React.Component<Props, State> {

    public state: State = {
        showSendButton: false,
    };

    public render() {
        const { poster } = this.props;

        return (
            <Form className={this.getClassNames()} onSubmit={this.props.onSubmit}>
                <UserAvatar user={poster} className={`pur-CommentBox__avatar`} />
                <Input
                    className={`pur-CommentBox__input`}
                    type={`text`}
                    name={`comment`}
                    placeholder={`Schrijf een reactie`}
                    onFocus={this.showSendButton}
                />
                {this.state.showSendButton && (
                    <Button type={`submit`} className={`pur-CommentBox__submit-button`}>
                        Reageer
                    </Button>
                )}
            </Form>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-CommentBox', {
            // 'pur-CommentBox--modifier-class': boolean,
        }, className);
    }

    private showSendButton = () => {
        this.setState({
            showSendButton: true,
        });
    }
}
