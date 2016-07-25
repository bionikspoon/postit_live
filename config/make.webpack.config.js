/* eslint default-case:0 */

const path = require('path');
const webpack = require('webpack');

const ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const autoprefixer = require('autoprefixer');

const npmPackage = require('../package.json');

const PRODUCTION = 'production';
const LOCAL = 'local';
const TEST = 'test';

module.exports = ({ PROJECT_ROOT, ENV }) => ({
  context: PROJECT_ROOT,

  entry: getEntry({ PROJECT_ROOT }),

  output: getOutput({ PROJECT_ROOT, ENV }),

  module: {
    preLoaders: getPreLoaders({ ENV }),
    loaders: getLoaders({ ENV }),
  },

  plugins: getPlugins({ ENV }),

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [path.resolve(PROJECT_ROOT, 'client/src'), 'node_modules'],
  },

  devtool: ENV === TEST ? 'inline-source-map' : undefined,
  watch: ENV !== PRODUCTION,
  devServer: getDevServer({ ENV }),

  postcss() {
    return [
      autoprefixer({ browsers: ['last 2 versions', 'ie >= 8'] }),
    ];
  },
});

function getEntry({ PROJECT_ROOT }) {
  const entry = {
    main: path.resolve(PROJECT_ROOT, 'client/src/index'),
    chat: path.resolve(PROJECT_ROOT, 'client/src/chat'),
    vendor: getVendor(),
  };
  return entry;
}

function getOutput({ PROJECT_ROOT, ENV }) {
  const output = {
    filename: '[name].[hash].js',
    sourcePrefix: '  ',
  };

  switch (ENV) {
    case PRODUCTION:
      output.path = path.resolve(PROJECT_ROOT, 'client/dist');
      break;

    case LOCAL:
      output.path = path.resolve(PROJECT_ROOT, 'client/dist/bundles');
      output.publicPath = 'http://localhost:8080/bundles/';
      break;

    case TEST:
      break;
  }
  return output;
}

function getPreLoaders({ ENV }) {
  const preLoaders = [];
  const eslint = { test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint' };

  switch (ENV) {
    case PRODUCTION:
      break;

    case LOCAL:
      preLoaders.push(eslint);
      break;

    case TEST:
      preLoaders.push(eslint);
      break;
  }
}

function getLoaders({ ENV }) {
  const loaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: { cacheDirectory: true },
    },
    { test: /\.json$/, loader: 'json-loader' },
  ];
  const scssLoader = { test: /\.sc?ss$/, loader: 'style!css!postcss!sass' };
  const urlLoader = { test: /\.(png|jpg|gif|woff|woff2)$/, loader: 'url', query: { limit: 8192 } };
  const fileLoader = { test: /\.(ttf|eot|svg|mp4|ogg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' };

  switch (ENV) {
    case PRODUCTION:
      loaders.push(scssLoader, urlLoader, fileLoader);
      break;

    case LOCAL:
      loaders.push(scssLoader, urlLoader, fileLoader);
      break;

    case TEST:
      loaders.push({ test: /\.(png|jpg|gif|woff|woff2|scss|ttf|eot|svg|mp4|ogg)$/, loader: 'null' });
      break;
  }
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
      jQuery: 'jquery',
      'window.Tether': 'tether',
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
    case PRODUCTION:
      plugins.push(chunkVendor, chunkCommon);

      // production bundle stats file
      plugins.push(new BundleTracker({ filename: './webpack-stats-production.json' }));

      // removes duplicate modules
      plugins.push(new webpack.optimize.DedupePlugin());

      // pass options to uglify
      plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }));

      // minifies your code
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: false,
      }));

      plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
      plugins.push(new webpack.optimize.AggressiveMergingPlugin());
      break;

    case LOCAL:
      plugins.push(chunkVendor, chunkCommon);

      // local bundle stats file
      plugins.push(new BundleTracker({ filename: './webpack-stats.json' }));

      // OSX wont check but other unix os will
      plugins.push(new ForceCaseSensitivityPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      break;

    case TEST:
      break;
  }
  return plugins;
}

function getDevServer({ ENV }) {
  if (ENV !== LOCAL) return undefined;
  return {
    noInfo: true,
    colors: true,
    inline: true,
    hot: true,
    hotInline: true,
    historyApiFallback: true,
  };
}

function getVendor() {
  return Object.keys(npmPackage.dependencies);
}
