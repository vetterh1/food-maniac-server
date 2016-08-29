var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

if(process.env.NODE_ENV === 'development'){
  var loaders = ['react-hot','babel-loader?presets[]=es2015&presets[]=react'];
} else {
  var loaders = ['babel-loader?presets[]=es2015&presets[]=react']
}

module.exports = {
  /*devtool: 'eval',*/
  entry: [
    './app/index.js'
  ],
  output: {
    filename: "/index_bundle.js",
    path: __dirname + '/dist'
  },
  plugins: [
    HTMLWebpackPluginConfig
  ],  
  module: {
    loaders: [{ 
      test: /\.js$/, 
      /*include: __dirname + '/app',*/
      exclude: /node_modules/, 
      loaders: loaders
    }]
  },
  devServer: {
    inline:true,
    port: 8080
  }
}
