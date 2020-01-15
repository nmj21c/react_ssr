const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  target: 'node',

  node: false, // it enables '__dirname' in files. If is not, '__dirname' always return '/'.

  entry: {
    server: './src/server.js',
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', 'jsx'],
  },

  externals: [nodeExternals()],
};