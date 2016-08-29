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
 *    2 - Build only:
 *
 *            npm run build
 *
 *    3 - Build & Run
 *    
 *            npm start
 *
 *    4 - Server rendering
 *
 *          NODE_SERVER_RENDER=true / set "NODE_SERVER_RENDER=true"
 *          NODE_SERVER_RENDER=false / set "NODE_SERVER_RENDER=false"
 * 
 *    Note on combining: 
 *    - Unix: NODE_ENV=production npm start
 *    - Windows: SET "NODE_ENV=dev" && npm start
 *    
 */


var webpack = require('webpack')

console.log("[lve] Start webpack");

var plugins = [];
if(process.env.NODE_ENV === 'production'){
  console.log("[lve] Production mode");
  plugins.push(    
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
}
else {  
  console.log("[lve] NOT in Production mode");
}

/* Plugin to inject bundle dist path in index.html */  
if(process.env.NODE_SERVER_RENDER != 'true'){
  console.log("[lve] NOT in Server rendering mode");
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
  });
  plugins.push( HTMLWebpackPluginConfig );
} else {
    console.log("[lve] NOT in Server rendering mode");
}



/*
 *   Loaders:
 *   - babel: ES6 --> ES5
 *   - babel: JSX --> JS
 *   
 */
var loaders = ['babel-loader?presets[]=es2015&presets[]=react'];
if(process.env.NODE_ENV != 'production'){
  // loaders.push('react-hot');
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
