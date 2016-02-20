var path = require('path');
var webpack = require('webpack');
var merge = require('merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackConfig = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  externals: {
      //require("jquery") 是引用自外部模块的
      //对应全局变量 jQuery
      // may be the materialize
      //"jquery": "jQuery"
  },
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig = merge(webpackConfig,{
    devtool: "source-map",
    entry : [
      './src/client/index.js'
    ],
    module: {
      loaders: [
      {test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src')},
      { test: /\.(png|jpg|gif|jpeg)$/, loader: 'url?limit=8192'},
      {
          test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
          loader: 'url-loader?limit=8192'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]},
    plugins : [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin("app.css"),
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]  
  });

}else{

  webpackConfig = merge(webpackConfig,{
    devtool: 'eval',
    module: {
      loaders: [
      {test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src')},
      { test: /\.(png|jpg|gif|jpeg)$/, loader: 'url?limit=8192'},
      {
          test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
          loader: 'url-loader?limit=8192'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]},
    entry : [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/client/index.js'
    ],
    plugins : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ]  
  });
  
}

module.exports = webpackConfig;
