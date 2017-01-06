var webpack = require('webpack');
var path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';
const indexEntry = ['./src/index.js'];

module.exports = {
  context: __dirname,
  entry: {
    index: indexEntry,
  },
  target: 'node',
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test    : /\.jsx?$/,
        exclude : /node_modules/,
        loader  : 'babel',
      }, {
        test   : /\.json$/,
        loader : 'json'
      },
    ],
  },

  resolve: {
    alias: { // aliases for frequently used paths.  Aliases are referenced like modules
    },
  },
  devtool: '#dev-module-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      isDevelopment,
    }),
    new webpack.ProvidePlugin({
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
