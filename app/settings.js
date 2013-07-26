var path = require('path')

var dev_port = 3000;

exports.PORT = process.env.PORT || dev_port;
exports.HOST_NAME = process.env.HOST_NAME || "http://localhost:" + dev_port;

exports.COOKIE_SECRET = 'your secret here';
exports.SESSION_SECRET = 'your secret here';

exports.GOOGLE_CLIENT_ID = "490235490406.apps.googleusercontent.com";
exports.GOOGLE_CLIENT_SECRET = "GCH9uzArIqv4mgpW-uftKeIE";
exports.GOOGLE_CALLBACK_URL = exports.HOST_NAME + "/auth/google/callback";