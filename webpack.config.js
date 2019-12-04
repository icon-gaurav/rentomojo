var path = require('path');

module.exports = {
    entry: './public/javascripts/Client.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    output: {
        filename: 'build.js',
        path: __dirname + '/public/javascripts/'

    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            [
                                "@babel/plugin-proposal-class-properties"
                            ]
                        ]
                    }
                }]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },

        ],

    }
};
