const path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
        service: path.resolve(__dirname, 'src/service.js')
    },
    output: {
        path: path.resolve(__dirname, 'web/dist'),
        filename: '[name].js'
    },
    mode: 'development'
};