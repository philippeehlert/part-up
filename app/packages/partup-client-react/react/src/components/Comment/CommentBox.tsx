import './CommentBox.css';

import * as React from 'react';
import * as c from 'classnames';
import { Input } from 'components/Form/Input';
import { Button } from 'components/Button/Button';
import { Form } from 'components/Form/Form';
import { translate } from 'utils/translate';

interface Props {
    className?: string;
    onSubmit: (e: any, fields: any) => void;
    defaultValue?: string;
    avatar?: JSX.Element;
    onBlur?: Function;
    autoFocus?: boolean;
}

interface State {
    showSendButton: boolean;
}

export class CommentBox extends React.Component<Props, State> {

    public state: State = {
        showSendButton: false,
    };

    private inputElement: Input|null = null;

    public render() {
        const { defaultValue, avatar, autoFocus } = this.props;

        return (
            <Form
                className={this.getClassNames()}
                onSubmit={this.onSubmit}
                onBlur={this.onBlur}>
                { avatar && (
                    <div className={`pur-CommentBox__avatar`}>
                        { avatar }
                    </div>
                ) }
                <Input
                    className={`pur-CommentBox__input`}
                    type={`text`}
                    name={`comment`}
                    ref={el => this.inputElement = el}
                    placeholder={translate('pur-dashboard-comment_box-comment_placeholder')}
                    onFocus={this.showSendButton}
                    defaultValue={defaultValue}
                    autoFocus={autoFocus}
                />
                {this.state.showSendButton && (
                    <Button type={`submit`} className={`pur-CommentBox__submit-button`}>
                        {translate('pur-dashboard-comment_box-comment_comment')}
                    </Button>
                )}
            </Form>
        );
    }

    public focus() {
        if (this.inputElement) this.inputElement.focus();

        this.showSendButton();
    }

    private onSubmit = (event: React.SyntheticEvent<any>, fields: Object) => {
        const { onSubmit } = this.props;

        if (this.inputElement) this.inputElement.clear();

        if (onSubmit) onSubmit(event, fields);
    }

    private onBlur = (event: React.FocusEvent<any>) => {
        const { onBlur } = this.props;

        if (event.relatedTarget) return;

        if (onBlur) onBlur(event);
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
