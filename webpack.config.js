/* eslint-disable */

const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        // 'besieged-fortress-jquery.js': './src/besieged-fortress/client-jquery/index.ts',
        // 'besieged-fortress-styles.js': './styles/besieged-fortress/index.scss',
        'bisley-react.js': './src/bisley/client-react/index.tsx',
        'bisley-styles.js': './styles/bisley/index.scss',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules\|tests/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'wwwroot', 'dist'),
    },
};
