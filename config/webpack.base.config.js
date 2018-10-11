var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const host = "http://localhost:8000";
module.exports = {
  mode: "development",
    entry: [
  'webpack-dev-server/client?' + host,
  'webpack/hot/only-dev-server',
      path.resolve('src')+'/App.jsx'
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundler.js',
        publicPath: '/',
    },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          
        }
      },
      {
        test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'sass-loader'
          ]
        /*
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader",
        })
        */
      }
    ]
  },
  devServer: {
  host: 'localhost',
        port: 8000,
        contentBase: path.join(__dirname, 'public'),
    },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin()
  ]
}
