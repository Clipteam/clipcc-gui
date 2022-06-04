import React from 'react';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import BrowserModalComponent from '../components/browser-modal/browser-modal.jsx';
import supportedBrowser from '../lib/supported-browser';
import * as Sentry from '@sentry/react';
import SentryRRWeb from '@sentry/rrweb';
import {isProd, appVersion, appVersionFull} from '../lib/app-info';
import styles from './index.css';

// Register "base" page view
analytics.pageview('/');
Sentry.init({
    dsn: 'https://ed881d9f133e457d8cdca25202200c3f@o1098997.ingest.sentry.io/6123390',
    integrations: [
        new SentryRRWeb({
            checkoutEveryNms: 2 * 60 * 1000
        })
    ],
    release: isProd ? appVersion : appVersionFull,
    environment: isProd ? 'stable' : 'canary',
    tracesSampleRate: 0.5
});
global.Sentry = Sentry;

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

if (supportedBrowser()) {
    // require needed here to avoid importing unsupported browser-crashing code
    // at the top level
    require('./render-gui.jsx').default(appTarget);

} else {
    BrowserModalComponent.setAppElement(appTarget);
    const WrappedBrowserModalComponent = AppStateHOC(BrowserModalComponent, true /* localesOnly */);
    const handleBack = () => {};
    // eslint-disable-next-line react/jsx-no-bind
    ReactDOM.render(<WrappedBrowserModalComponent onBack={handleBack} />, appTarget);
}
