const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'app-jquery.js': './src/app-jquery/index.ts',
        'styles.js': './styles/index.scss',
        // 'vendor.js': [
        //     // path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.js'),
        //     // path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.css'),
        //     path.resolve(__dirname, 'vendor', 'jquery-ui.min.js'),
        //     path.resolve(__dirname, 'vendor', 'jquery-ui.min.css'),
        // ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
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
