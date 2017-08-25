import _ from 'lodash';

/**
 * The partup file uploader.
 * 
 * @class _Pluploader
 */
class _Pluploader {
    constructor(options) {
        // Setting the plupload configuration
        const config = _.extend({
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
                    // TAPi18n.__(`partup-files-error-${error.code}`)
                }
            },
        }, options.config);

        // extend the new pluploader with this class,
        // or write a class API that encapsulates the pluploader and assign uploader to this.uploader;
        const uploader = _.merge(
            new plupload.Uploader(config), 
            this
        );

        uploader.setMimeFilters(options.types);
        uploader._registerHooks(options.hooks);
        if (options.dynamic_url) {
            uploader._registerDynamicUrl();
        }

        return uploader;
    }

    clearQueue() {
        // .pop() removes the memory allocation of the item
        while (this.files.length > 0) { 
            this.files.pop();
        }
    }
    setMimeFilters(types) {
        if (!types || types.length < 1) {
            return;
        }
        const filters = this.getOption('filters');
        filters.mime_types = _.map(types, type => ({ title: type.name, extensions: type.extensions }));
        this.setOption('filters', filters);
    }
    addMimeFilter(type) {
        if (!type) {
            return;
        }
        const filters = this.getOption('filters');
        filters.mime_types.push({ title: type.name, extensions: type.extensions });
        this.setOption('filters', filters);
    }
    removeMimeFilter(name) {
        if (!name) {
            return;
        }
        const filters = this.getOption('filters');
        _.remove(filters.mime_types, {
            title: name,
        });
        this.setOption('filters', filters);
    }
    setMaxFileSize(size) {
        if (!typeof size === String || !typeof size === typeof Number) {
            return;
        }
        const filters = this.getOption('filters');
        filters.max_file_size = size;
        this.setOption('filters', filters);
    }

    _registerDynamicUrl() {
        this.bind('BeforeUpload', (uploader, file) => {
            let filetype = file.type.substr(0, file.type.indexOf('/'));
            uploader.setOption('url', `${Partup.client.window.location}/${filetype}s/upload?token=${Accounts._storedLoginToken()}`);
        });
    }

    _registerHooks(hooks) {
        _.each(Object.keys(hooks), key => this.bind(key, hooks[key]));
    }
}

Pluploader = _Pluploader;
