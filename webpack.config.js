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
// const WebpackShellPlugin = require('webpack-shell-plugin');
// const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const childProcess = require('child_process');

logger.info('[FoServer] Start webpack (using webpack.config.js)');

const distPath = path.join(__dirname, '/distFoServer');
logger.info(`distPath: ${distPath}`);

const gitBranch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString();
const gitLastCommitComment = childProcess.execSync('git log -1 --pretty=%B ').toString();
const gitLastCommitDate = childProcess.execSync('git log -1 --format=%cd').toString();
logger.info(`Branch: ${gitBranch}`);
logger.info(`Last commit comment: ${gitLastCommitComment}`);
logger.info(`Last commit date: ${gitLastCommitDate}`);

//
// Plug-ins (prod & dev)
//
// In prod mode: call minifiers plugins
// (in addition to the inject bundle plugin)
//

const plugins = [];

// Provide variables to JS client code (see Version component):
plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        NPM_VERSION: JSON.stringify(process.env.npm_package_version),
        GIT_BRANCH: JSON.stringify(gitBranch),
        GIT_LAST_COMMIT_COMMENT: JSON.stringify(gitLastCommitComment),
        GIT_LAST_COMMIT_DATE: JSON.stringify(gitLastCommitDate),
      },
    })
  );

// plugins.push(
//   new webpack.optimize.CommonsChunkPlugin({
//     name: 'vendor',
//     minChunks: function (module) {
//        // this assumes your vendor imports exist in the node_modules directory
//        return module.context && module.context.indexOf('node_modules') !== -1;
//     },
//     filename: 'vendor.bundle.[hash].js',
//   }),
// );


// Explanation here: https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
      // this assumes your vendor imports exist in the node_modules directory
      return module.context && module.context.indexOf('node_modules') !== -1;
    },
  }),
  // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest', // But since there are no more common modules between them we end up with just the runtime code included in the manifest file
  })
);


// PRODUCTION OPTIMIZATIONS
if (process.env.NODE_ENV === 'production') {
  logger.info('[FoServer] Production mode');
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
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


const jsEntry = [
  './app/index.jsx',
];

module.exports = {
  entry: {
    main: jsEntry, // Notice that we do not have an explicit vendor entry here
    // vendor: ['react', 'react-dom', 'react-router'],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'app',
      'node_modules',
    ],
  },

  output: {
    // filename: 'bundle.js',
    filename: '[name].[chunkhash].js',
    path: distPath,
    // chunkFilename: '[name].[hash].bundle.js',
  },

  plugins,

  module: {
    loaders: [
      // loader for all app (NOT node modules):
      { test: /\.js.?$/, exclude: /node_modules/, loader: 'babel-loader' },
      // css loader to import CSS ES6 style (ex: import 'bootstrap/dist/css/bootstrap.css')
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      // loader for react-icons:
      { test: /(\.js|\.jsx)$/, loader: 'babel', include: [path.resolve(__dirname, './node_modules/react-icons/fa'), path.resolve(__dirname, './node_modules/react-icons/go')], query: { presets: ['es2015', 'stage-0', 'react'] } },
    ],
  },

  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        secure: false,
      },
      '/util': {
        target: 'http://localhost:8085',
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:8085',
        secure: false,
      },
      '/static': {
        target: 'http://localhost:8085',
        secure: false,
      },
      '/logs': {
        target: 'http://localhost:8085',
        secure: false,
      },
    },
  },

  devtool: 'source-map',
};
