var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const host = "http://localhost:5000/";
console.log(process.env.ENV);

const environment = process.env.ENV;
let entryPoints = [];

if(environment == "development"){
  entryPoints.push('webpack-dev-server/client?' + host);

}

entryPoints.push('webpack/hot/only-dev-server');
entryPoints.push(path.resolve('src')+'/App.jsx');

module.exports = {
  mode: environment,
    entry: entryPoints,
    output: {
        filename: 'bundler.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
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
  port: 5000,
  contentBase: path.join(__dirname, 'public'),
  proxy: {
    "*": {
      target: "http://localhost:3000",
      secure: false,

    },
  },
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
