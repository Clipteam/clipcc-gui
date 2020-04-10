import defaults from 'lodash.defaultsdeep';

const params = values => (
    Object.keys(values).map(key => {
        const value = typeof values[key] === 'undefined' ? '' : values[key];
        const encodeKeyValuePair = val => (
            [key, val].map(encodeURIComponent).join('=')
        );
        if (Array.isArray(value)) {
            return value.map(encodeKeyValuePair).join('&');
        }
        return encodeKeyValuePair(value);
    }).join('&')
);

const api = (opts, callback) => {
    defaults(opts, {
        host: process.env.API_HOST,
        headers: {},
        responseType: 'json'
    });

    if (opts.host === '') {
        defaults(opts.headers, {
            'X-Requested-With': 'XMLHttpRequest'
        });
    }

    opts.uri = opts.host + opts.uri;

    if (opts.params) {
        opts.uri = [opts.uri, params(opts.params)]
            .join(opts.uri.indexOf('?') === -1 ? '?' : '&');
    }

    if (opts.formData) {
        opts.body = params(opts.formData);
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const apiRequest = options => {
        if (options.host !== '') {
            if ('withCredentials' in new XMLHttpRequest()) {
                options.useXDR = false;
            } else {
                // For IE < 10, we must use XDR for cross-domain requests. XDR does not support
                // custom headers.
                options.useXDR = true;
                delete options.headers;
                if (options.authentication) {
                    const authenticationParams = [`x-token=${options.authentication}`];
                    const parts = options.uri.split('?');
                    const qs = (parts[1] || '')
                        .split('&')
                        .concat(authenticationParams)
                        .join('&');
                    options.uri = `${parts[0]}?${qs}`;
                }
            }
        }
        xhr(options, (err, res, body) => {
            if (err) log.error(err);
            if (options.responseType === 'json' && typeof body === 'string') {
                // IE doesn't parse responses as JSON without the json attribute,
                // even with responseType: 'json'.
                // See https://github.com/Raynos/xhr/issues/123
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    // Not parseable anyway, don't worry about it
                }
            }
            // Legacy API responses come as lists, and indicate to redirect the client like
            // [{success: true, redirect: "/location/to/redirect"}]
            try {
                if ('redirect' in body[0]) window.location = body[0].redirect;
            } catch (e) {
                // do nothing
            }
            callback(err, body, res);
        });
    };

    if (opts.authentication) {
        opts.headers['X-Token'] = opts.authentication;
    }
    
    apiRequest(opts);
};

export default api;
