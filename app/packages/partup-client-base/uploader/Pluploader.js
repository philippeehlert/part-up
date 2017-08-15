// import plupload from './plupload/plupload.min.js';

import _ from 'lodash';

class _Pluploader {
    constructor(options) {

        const config = {
            browse_button: 'browse_button',
            url: '/',
            flash_swf_url: './runtimes/Moxie.swf',
            silverlight_xap_url: './runtimes/Moxie.xap',
            filters: {
                max_file_size: '10mb',
                prevent_duplicates: true,
            },
            init: {
                Error(uploader, error) {
                    Partup.client.notify.error(error.message);
                }
            }
        }

        // Setting the plupload configuration
        _.extend(config, options.config);
        this.setFileFilters(options.types, config);

        // extend the new pluploader with this class.
        const uploader = _.merge(new plupload.Uploader(config), this);

        if (options.dynamic_url) {
            uploader.bind('BeforeUpload', function (uploader, file) {
                let location = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                let filetype = file.type.substr(0, file.type.indexOf('/'));
                let token = Accounts._storedLoginToken();

                let url = `${location}/${filetype}s/upload?token=${token}`;
                uploader.setOption('url', url);
            });
        }

        _.each(Object.keys(options.hooks), key => uploader.bind(key, options.hooks[key]));

        uploader.init();
        return uploader;
    }

    setFileFilters(types, config) {
        if (!types || types.length < 1) {
            return;
        }
        config.filters.mime_types = [];
        const filters = _.reduce(types, (result, type) => {
            result.push({
                title: type.name,
                extensions: type.extensions,
            });
            return result;
        }, []);

        _.each(filters, filter => config.filters.mime_types.push(filter));
    }
}

Pluploader = _Pluploader;
