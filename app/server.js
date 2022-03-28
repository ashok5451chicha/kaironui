/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const app = express();
const fs = require('fs');
const env_file = './data/AppProps.json';
var env = require(env_file);
for (e_var in env) {
    if (process.env[e_var]) {
        env[e_var] = process.env[e_var];
        console.log(env[e_var]);
    }
}
fs.writeFileSync(env_file, JSON.stringify(env));
app.disable('x-powered-by');
app.use(helmet.frameguard({ action: 'DENY' }));
app.use(
    express.static(__dirname, {
        setHeaders: (res, path, stat) => {
            if (path.includes('/cdn/')) {
                res.removeHeader('X-Frame-Options');
            }
        },
    }),
);
// need to declare a "catch all" route on your express server
// that captures all page requests and directs them to the client
// the react-router do the route part
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), {
        maxAge: 86400000,
    });
});
app.listen(process.env.PORT || 8080, function () {
    console.log(`Frontend start on http://localhost:8080`);
});
