const path = require("path");

module.exports = {
    entry: "./src/index.js",
    devtool: "eval-source-map",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        // loaders: [{
        //     test: /\.js?$/,
        //     exclude: /node_modules/,
        //     loader: "babel-loader",
        //     query: {
        //         presets: ["env"],
        //     }
        // }],
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-object-rest-spread"],
                    },
                },
            },
        ],
    },
};
