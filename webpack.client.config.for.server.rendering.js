var webpack = require('webpack')

console.log("[lve] Start webpack");

var plugins = [];
if(process.env.NODE_ENV === 'production'){
  plugins.push(    
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
}

/* Plugin to inject bundle dist path in index.html */  
if(process.env.NODE_SERVER_RENDER != 'true'){
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
  });
  plugins.push( HTMLWebpackPluginConfig );
}


/*
 *   Loaders:
 *   - babel: ES6 --> ES5
 *   - babel: JSX --> JS
 *   
 */
var loaders = ['babel-loader?presets[]=es2015&presets[]=react'];
if(process.env.NODE_ENV != 'production'){
  loaders.push('react-hot');
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
  plugins: 
    plugins,
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
