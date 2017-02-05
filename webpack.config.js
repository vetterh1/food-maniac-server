/*
 *    USAGE:
 *
 *    1 - Set Dev or Prod env:
 *
 *    - Unix:
 *            NODE_ENV=production
 *            NODE_ENV=dev
 *
 *    - Windows:
 *            SET "NODE_ENV=production"
 *            SET "NODE_ENV=dev"
 *
 *    2 - Build only: add "npm run build"
 *
 *            ...env... npm run build
 *
 *    3 - Build & Run: add "npm start"
 *
 *            ...env... npm start
 *
 *    4 - Process Manager
 *
 *          npm run pm2:restart
 *
 *    Note on combining:
 *    - Unix: NODE_ENV=production; npm start
 *    - Windows: SET "NODE_ENV=dev" && npm start
 *
 *    Examples:
 *
 *          NODE_ENV=production npm run build
 *          npm run pm2:restart
 *
 */

const logger = require('winston');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

logger.info('[FoServer] Start webpack (using webpack.config.js)');

var distPath = path.join(__dirname, '/distFoServer');
logger.info(`distPath: ${distPath}`);


//
// Plug-ins (prod & dev)
//
// In prod mode: call minifiers plugins
// (in addition to the inject bundle plugin)
//

const plugins = [];
if (process.env.NODE_ENV === 'production') {
  logger.info('[FoServer] Production mode');
  plugins.push(
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin()
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.UglifyJsPlugin()
  );
} else {
  logger.info('[FoServer] NOT in Production mode');
}
// Plugin to inject bundle dist path in index.html
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, '/app/index.html'),
  filename: 'index.html',
  inject: 'body',
});
plugins.push(HTMLWebpackPluginConfig);

const distGitBranch = path.join(distPath, '/gitbranch.txt');
const distGitLastCommitComment = path.join(distPath, '/gitlastcommitcomment.txt');
const distGitLastCommitDate = path.join(distPath, '/gitlastcommitdate.txt');
const webpackShellPlugin = new WebpackShellPlugin({
  onBuildStart: [
    'echo "Starting shell plugin"',
    `git name-rev --name-only HEAD > ${distGitBranch}`,
    `git log -1 --pretty=%B > ${distGitLastCommitComment}`,
    `git log -1 --format=%cd > ${distGitLastCommitDate}`,
  ],
});
plugins.push(webpackShellPlugin);

// Plugin to define version
const defineConfig = new webpack.DefinePlugin({
  __VERSION__: JSON.stringify(process.env.npm_package_version),
});
plugins.push(defineConfig);

logger.info(`npm version: ${process.env.npm_package_version}`);
logger.info(`git branch: ${distGitBranch}`);
logger.info(`git last commit comment: ${distGitLastCommitComment}`);
logger.info(`git last commit date: ${distGitLastCommitDate}`);

/*
 *   Loaders:
 *   - babel: ES6 --> ES5
 *   - babel: JSX --> JS
 *
 */

const loaders = ['babel-loader'];
if (process.env.NODE_ENV !== 'production') {
  loaders.push('react-hot');
}


module.exports = {
  entry: [
    './app/index.jsx',
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      'app',
      'node_modules',
    ],
  },

  output: {
    filename: '/bundle.js',
    path: distPath,
  },

  plugins,

  module: {
    loaders: [{
      test: /\.js.?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      // loader: loaders
    }],
  },

  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 8080,
    proxy: {
      '^/api/*': {
        target: 'http://localhost:8085/api/',
        secure: false,
      },
    },
  },

  devtool: 'source-map',
};
