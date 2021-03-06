import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';
import baseConfig from './webpack.base.config.js';


module.exports = (opts) => {

  const
    {PROJECT_ROOT} = opts,
    config = baseConfig(opts);

  return {
    ...config,
    output: {
      ...config.output,
      path: path.resolve(PROJECT_ROOT, 'postit_live/static/postit-live/dist/'),
    },
    plugins: [
      ...config.plugins,
      // production bundle stats file
      new BundleTracker({filename: './webpack-stats-production.json'}),
      // pass options to uglify
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      // minifies your code
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
        sourceMap: false,
      }),
      // removes duplicate modules
      new webpack.optimize.DedupePlugin(),
    ],
  };
};
