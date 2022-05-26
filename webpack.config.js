const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        iife: false,
        clean: true,
        filename: 'pocke-hacks.js',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src/'),
        },
    },
}
