/* eslint default-case:0 */
const path = require('path');
const webpack = require('webpack');
const ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = ({ PROJECT_ROOT, ENV }) => ({
  context: PROJECT_ROOT,

  entry: getEntry({ PROJECT_ROOT }),

  output: getOutput({ PROJECT_ROOT, ENV }),

  module: {
    preLoaders: getPreLoaders({ ENV }),
    loaders: getLoaders(),
  },

  plugins: getPlugins({ ENV }),

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [path.resolve(PROJECT_ROOT, 'client/src'), 'node_modules'],
  },

  devtool: ENV === 'test' ? 'inline-source-map' : undefined,
});

function getEntry({ PROJECT_ROOT }) {
  const entry = {
    main: path.resolve(PROJECT_ROOT, 'client/src/index'),
    chat: path.resolve(PROJECT_ROOT, 'client/src/chat'),
    vendor: ['react', 'redux', 'react-router', 'react-redux', 'react-dom'],
  };
  return entry;
}

function getOutput({ PROJECT_ROOT, ENV }) {
  const output = {
    filename: '[name].[hash].js',
  };

  switch (ENV) {
    case 'production':
      output.path = path.resolve(PROJECT_ROOT, 'client/dist');
      break;

    case 'local':
      output.path = path.resolve(PROJECT_ROOT, 'client/dist/bundles');
      output.publicPath = 'http://localhost:8080/bundles/';
      break;

    case 'test':
      break;
  }
  return output;
}

function getPreLoaders({ ENV }) {
  const preLoaders = [];
  const eslint = { test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint' };

  switch (ENV) {
    case 'production':
      break;

    case 'local':
      preLoaders.push(eslint);
      break;

    case 'test':
      preLoaders.push(eslint);
      break;
  }
}

function getLoaders() {
  const loaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: { cacheDirectory: true },
    },
    { test: /\.scss$/, loader: 'style!css!sass' },
    { test: /\.css$/, loader: 'style!css' },
    { test: /\.(png|jpg|gif)$/, loader: 'url', query: { limit: 8192 } },  // inline base64 URLs <=8k
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
  ];
  return loaders;
}

function getPlugins({ ENV }) {
  // add all common plugins here
  const plugins = [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(ENV) } }),

    // Promise and fetch polyfills
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ];

  // karma webpack can't use these
  const chunkVendor = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor', minChunks: Infinity, filename: '[name].[hash].js',
  });

  // add common modules here
  const chunkCommon = new webpack.optimize.CommonsChunkPlugin({
    name: 'common', filename: '[name].[hash].js', chunks: [],
  });

  switch (ENV) {
    case 'production':
      plugins.push(chunkVendor, chunkCommon);

      // production bundle stats file
      plugins.push(new BundleTracker({ filename: './webpack-stats-production.json' }));

      // pass options to uglify
      plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }));

      // minifies your code
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: false,
      }));

      // removes duplicate modules
      plugins.push(new webpack.optimize.DedupePlugin());
      break;

    case 'local':
      plugins.push(chunkVendor, chunkCommon);

      // local bundle stats file
      plugins.push(new BundleTracker({ filename: './webpack-stats.json' }));

      // OSX wont check but other unix os will
      plugins.push(new ForceCaseSensitivityPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      break;

    case 'test':
      break;
  }
  return plugins;
}
