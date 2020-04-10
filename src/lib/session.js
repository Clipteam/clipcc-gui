import api from './api'

const requestSessionWithRetry = (resolve, reject, retriesLeft, totalDelayMS) => {
    api({
        host: '',
        uri: '/session/'
    }, (err, body, response) => {
        if (err || (response && response.statusCode === 404)) {
            return reject(err);
        }
        if (typeof body === 'undefined' || body === null || !body.user) {
            if (retriesLeft < 1) {
                return resolve(body);
            }
            const nextTimeout = totalDelayMS / (Math.pow(2, retriesLeft) - 1);
            return setTimeout(
                requestSessionWithRetry.bind(
                    null, resolve, reject, retriesLeft - 1, totalDelayMS - nextTimeout
                ),
                nextTimeout
            );
        }
        return resolve(body);
    });
};

const requestSession = (resolve, reject) => (
    requestSessionWithRetry(resolve, reject, 0, 0)
);

export {
    requestSessionWithRetry,
    requestSession
};
