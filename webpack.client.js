const path = require('path');
const webpack = require('webpack');

const hotMiddlewareScript = `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true`;

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  entry: [hotMiddlewareScript, './src/index.js'],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', 'jsx'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};