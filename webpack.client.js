const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');

const hotMiddlewareScript = `webpack-hot-middleware/client?name=web&path=/__webpack_hmr&timeout=20000&reload=true`;

const getEntryPoint = (target) => {
  if (target === 'node') {
    return ['./src/App.js'];
  } else {
    return [hotMiddlewareScript, './src/index.js'];
  }
}

const getConfig = (target) => ({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  name: target,

  target,

  entry: getEntryPoint(target),

  output: {
    path: path.resolve(__dirname, `dist/${target}`),
    filename: '[name].js',
    publicPath: `/assets/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
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

  plugins: target === 'web' ? [new LoadablePlugin(), new webpack.HotModuleReplacementPlugin()] : [new LoadablePlugin()],

  externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
});

module.exports = [getConfig('web'), getConfig('node')];