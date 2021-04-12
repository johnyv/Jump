const path = require('path')

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: ['./index.js'],
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'game.js',
    }
    ,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                'corejs': '3',
                                'useBuiltIns': 'usage'
                            }]
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
        ]
    }
};
