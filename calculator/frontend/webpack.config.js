const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
            },
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          //query: {
          //  presets: 'react'
          //}
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i, 
            loader: 'file-loader',
            options: {
                /*name: '/public/icons/[name].[ext]'*/
                name: '/static/images/[name].[ext]'
            }
        },
        {
            test: /\.css$/i,
            sideEffects: true,
            use: ["style-loader", "css-loader"],
        },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
        /* 'process.env.NODE_ENV': JSON.stringify('production') */
    }),
    /*new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),*/
  ],
};