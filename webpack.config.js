var webpack = require('webpack')

/* 
 *  Plugin to inject bundle dist path in index.html 
 *
 *  NOT USED WITH SERVER RENDERING AS NO INDEX.HTML FILE
 *  
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});
/
/*
 *   Loaders:
 *   - babel: ES6 --> ES5
 *   - babel: JSX --> JS
 *   
 */
if(process.env.NODE_ENV === 'development'){
  var loaders = ['react-hot','babel-loader?presets[]=es2015&presets[]=react'];
} else {
  var loaders = ['babel-loader?presets[]=es2015&presets[]=react']
}

module.exports = {
  entry: [
    './app/index.js'
  ],
  output: {
    filename: "/bundle.js",
    path: __dirname + '/dist'
  },
  /*
   * In prod mode: call minifiers plugins
   * (in addition to the inject bundle plugin )
   */
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
    /*,HTMLWebpackPluginConfig*/
  ] : [/*HTMLWebpackPluginConfig*/],  
  module: {
    loaders: [{ 
      test: /\.js$/, 
      exclude: /node_modules/, 
      loaders: loaders
    }]
  },
  devServer: {
    inline:true,
    port: 8080
  }
}
