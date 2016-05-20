const config = require('./../../webpack.config.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
var helmet = require('helmet')

module.exports = function(app) {
  // Compile Webpack and middleware
  const compiler = webpack(config);

  // Middleware
  app.use(helmet({
    frameguard: {
      action: 'sameorigin'
    }
  }));
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(morgan('dev'));
  app.use(cors());
  
  if (process.env.NODE_ENV !== 'production') {
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
  }
};
