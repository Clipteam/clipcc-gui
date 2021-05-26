const fs = require('fs');
const path = require('path');
const moment = require('moment');

const time = new Date();
const compileId = moment(time).format('YYYYMMDDHHmm');

const code = `// Generated by gen-meta.js
const appName = 'ClipCC';

const appVersion = '3.0.0';
const appVersionSimple = '3.0';
const appVersionFull = '3.0.0-b${compileId}';
const compileTime = '${time.toISOString()}'

export {
    appVersion, appVersionSimple, appVersionFull, compileTime
};
`;

fs.writeFileSync(path.join(__dirname, 'src/lib/app-info.js'), code);