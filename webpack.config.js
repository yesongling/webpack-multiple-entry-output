const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');

let pages = [];
const entry = {
  vendors: ['vue']
};

const plugins = [
  new CleanWebpackPlugin({
    cleanStaleWebpackAssets: true,
    verbose: true,
    dry: false
  }),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  }),
  new ExtractTextPlugin({
    filename: (getPath) => {
      return getPath('css/[name].min.css').replace('\\js', '').replace('\\', '');
    },
    allChunks: true
  }),
]

const getEntries = (globPath, pathDir) => {
  let files = glob.sync(globPath);
  let entries = {},
    entry, dirname, basename, pathname, extname, parentPath;

  for (let i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
    parentPath = dirname.split(/\//);
    entries[parentPath[parentPath.length-1]] = [dirname.replace(/^src\/js\//,''),entry];
  }
  return entries;
};

const jsFiles = Object.values(getEntries('src/js/**/*.js', 'src'));

jsFiles.forEach((item, index) => {
  const filePathArray = item[1].split('/');
  const fileName = filePathArray[filePathArray.length-2];
  // const conf = {
  //   filename: 'index.html',
  //   template: 'src/' + item[1].replace(/main$/,'index') + '.html',
  //   inject: 'body',
  //   chunks: ['vendors', 'manifest', fileName]
  // };
  // plugins.push(new HtmlWebpackPlugin(conf));
  entry[item[0]] = `./${item[1]}`
});

module.exports = {
  devtool: 'source-map',
  entry: entry,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'javascript/[name]/main.js',
    chunkFilename: "javascript/[name]/main.chunk.js",
    publicPath: "/dist/"
  },
  externals: ["jquery", "vue"],
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor:{
          chunks:"all",
          test: /[\\/]node_modules[\\/]/,
          name:"vendor",
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority:100
        },
        common: {
          chunks:"all",
          test:/[\\/]src[\\/]js[\\/]/,
          name: "common",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority:1
        }
      }
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8001,
    inline: true, // live reload
  },
  module: {
    rules: [
      {
        test: /(\.scss|\.sass)/,
        use: {
          loader: 'sass-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'css-loader'
          },
          {
            loader: 'style-loader',
            options: {
              modules: true,
              // localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /jquery.js/,
        use: [
          {
            loader: 'expose-loader',
            options: '$'
          },
          {
            loader: 'expose-loader',
            options: 'jQuery'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.join(__dirname, 'src/lib'),path.join(__dirname, 'service/public'),path.join(__dirname, 'node_modules')],
    alias: {
      "jquery": path.join(__dirname, "src/lib/jquery.min"),
      "bootstrap": path.join(__dirname, "src/lib/bootstrap.min"),
      "bootstrap-datetimepicker": path.join(__dirname, "src/lib/bootstrap-datetimepicker.min"),
      "domReady": path.join(__dirname, "src/lib/domReady"),
      "vue": path.join(__dirname, "src/lib/vue"),
      "ELEMENT": path.join(__dirname, "src/lib/element-ui"),
      "progressBar": path.join(__dirname, "src/lib/project.progress"),
      "qrcode": path.join(__dirname, "src/lib/jquery.qrcode"),
      "fileUploader": path.join(__dirname, "src/lib/project.fileUploader"),
      "jquery-mousewheel": path.join(__dirname, "src/lib/jquery.mousewheel"),
      "jquery.mousewheel": path.join(__dirname, "src/lib/jquery.mousewheel"),
      "mCustomScrollbar": path.join(__dirname, "src/lib/jquery.mCustomScrollbar"),
      "mCustomScrollbar.concat": path.join(__dirname, "src/lib/jquery.mCustomScrollbar.concat.min"),
      "charts": path.join(__dirname, "src/lib/charts"),
      "dictionary": path.join(__dirname, "service/public/text/project.dictionary"),
      "MD5": path.join(__dirname, "src/lib/md5"),
      "bootstrap-datetimepicker.zh-CN": path.join(__dirname, "src/lib/locales/bootstrap-datetimepicker.zh-CN"),
      "sockjs": path.join(__dirname, "src/lib/sockjs"),
      "stomp": path.join(__dirname, "src/lib/stomp"),
      "kline": path.join(__dirname, "src/lib/kline.min"),
      "animation": path.join(__dirname, "src/lib/project.animation"),
      "decimal": path.join(__dirname, "src/lib/decimal.min"),
      "TradingView": path.join(__dirname, "service/public/charting_library/charting_library.min"),
      "polyfills": path.join(__dirname, "service/public/datafeeds/udf/dist/polyfills"),
      "bundle": path.join(__dirname, "service/public/datafeeds/udf/dist/bundle"),
      "captha": path.join(__dirname, "src/lib/TCaptcha"),
      "page": path.join(__dirname, "src/lib/page"),
      "global": path.join(__dirname, "src/lib/global"),
    },
  },
  plugins: plugins
}
