/**
 * module dependencies for express configuration
 */
const passport = require('passport');
const morgan = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const schedule = require('./schedule');

/**
 * express configuration
 */
const expressConfig = (app, serverConfigs) => {

  // apply gzip compression (should be placed before express.static)
  app.use(compress());

  // log server requests to console
  !serverConfigs.PRODUCTION && app.use(morgan('dev'));

  // get data from html froms
  app.use(bodyParser.json({limit:'5mb'}));
  app.use(bodyParser.urlencoded({ extended: true }));

  // read cookies (should be above session)
  app.use(cookieParser());

  // require("./enable-cors.js")(app);
  // use passport session
  app.use(passport.initialize());
  // use session with mongo
  // app.use(session({
  //   resave: false,
  //   saveUninitialized: true,
  //   secret: 'secret',
  //   store: new mongoStore({
  //     url: serverConfigs.DBURL,
  //     collection : 'sessions',
  //   }),
  //   cookie:{
  //     sameSite:'none',
  //     secure:true
  //   }
  // }));
  // app.use(passport.session());

  // apply passport configs
  require('./passport')(app);

  // connect flash for flash messages (should be declared after sessions)
  app.use(flash());

  // apply development environment additionals
  if (!serverConfigs.PRODUCTION) {
    require('./dev')(app);
  }

  // apply route configs
  require('./routes')(app);
  schedule();
};

module.exports = expressConfig;
