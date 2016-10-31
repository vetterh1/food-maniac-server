var logger = require('winston'); 
logger.info('... in webpack.config.hotreload');

var webpack = require('webpack')

//var loaders = ['babel-loader'];

module.exports = {

  entry: {
    app: [
//      'eventsource-polyfill',
      'webpack-hot-middleware/client',
//      'webpack/hot/only-dev-server',
//      'react-hot-loader/patch',
      './app/index.js'
    ]
    // ,
    // vendor: [
    //   'react',
    //   'react-dom',
    // ],
  },


  output: {
    filename: "/bundle.js",
    path: __dirname + '/dist'
  },

  plugins: [
      // Webpack 1.0
      new webpack.optimize.OccurenceOrderPlugin(),
      // Webpack 2.0 fixed this mispelling
      // new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [{ 
      test: /\.js.?$/, 
      exclude: /node_modules/, 
      loader: 'babel-loader'
    }]
  },
  devServer: {
    historyApiFallback: true,
    inline:true,
    port: 8080
  },
  devtool: "source-map"
}
