var path = require('path');

module.exports = {
    mode: "development",
    target: "node",
    devtool: "inline-source-map",
    watch: true,
    watchOptions: {
        ignored: ['dist', 'node_modules']
    },
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
        ]
    }
};