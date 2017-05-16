module.exports = {
    entry: "./app/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel",
            include: __dirname,
            query: {
                presets: ['es2015', 'react']
            }
        },
            {
                test: /\.css$/,
                loader: "css-loader"
            }
        ]
    }
};