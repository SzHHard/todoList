const path = require('path');

module.exports = {
    entry: './app/App.jsx',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};