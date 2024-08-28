const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './public/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundled_files.js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8080,
        hot: true, // Hot reloading
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // ES6 compatible
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}
