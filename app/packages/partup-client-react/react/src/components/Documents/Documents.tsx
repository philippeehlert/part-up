import './Documents.css';

import * as React from 'react';
import * as c from 'classnames';
import { Files, FileDocument } from 'collections/Files';

interface Props {
    className?: string;
    documents: string[];
}

interface State {
    files: FileDocument[];
}

export class Documents extends React.Component<Props, State> {

    public componentWillMount() {
        const {
            documents,
        } = this.props;

        const files = Files.findStatic().filter(({ _id }) => documents.includes(_id));

        this.setState({
            files,
        });
    }

    public render() {
        const { documents } = this.props;
        const { files } = this.state;

        return (
            <div className={this.getClassNames()}>
                <ul className={`document-icons icons-${documents.length}layout`}>
                    {files.map((file) => (
                        <li key={file._id}>
                            <a href={ file.link } target="_blank" rel="noopener">
                                <div className="file-download">
                                    <figure
                                        className="pu-download-icon"
                                        style={{ backgroundImage: `url('/images/add-media-icons/download.svg')` }}
                                    />
                                </div>
                                <div className="file-icon">
                                    <figure
                                        className="pu-doc-icon"
                                        style={{ backgroundImage: `url('/images/add-media-icons/file.svg')` }}
                                    />
                                </div>
                                <div className="file-information">
                                    <p className="file-name">{ file.name }</p>
                                    { file.bytes && (<p className="file-bytes">{this.binaryToShortSize(file.bytes)}</p>)}
                                    { file.service && (<p className="file-service">{ file.service }</p>)}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private binaryToShortSize(size: number) {
        if (!size) {
            return size;
        }

        const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
        const index = Math.floor(Math.log(size) / Math.log(1024));

        if (index === 0) {
            return `${size} ${sizes[index]}`;
        }

        return `${(size / Math.pow(1024, index)).toFixed(1)} ${sizes[index]}`;
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Documents', {
            // 'pur-Documents--modifier-class': boolean,
        }, className);
    }
}
