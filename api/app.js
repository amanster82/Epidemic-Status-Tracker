if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");
var enforce = require("express-sslify");

var app = express();

var createWhitelistValidator = function (whitelist) {
  return function (val) {
    for (var i = 0; i < whitelist.length; i++) {
      if (val === whitelist[i]) {
        return true;
      }
    }
    return false;
  };
};

var originWhiteList = [
  process.env.REACT_APP_API_URL,
  "http://localhost:3000",
  "http://amanster.ddns.net:3000",
];

var corsOptions = {
  allowOrigin: createWhitelistValidator(originWhiteList),
};

var handleCors = function (options) {
  return function (req, res, next) {
    if (options.allowOrigin) {
      console.log("made it here");
      var origin = req.header("origin");
      res.set("Access-Control-Allow-Origin", origin);
      res.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.set("Access-Control-Allow-Credentials", true);
      next();
    } else {
      res.set("Access-Control-Allow-Origin", "*");
    }
  };
};

app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(handleCors(corsOptions));
//res.header("Access-Control-Allow-Origin", "http://amanster.ddns.net:3000");
//res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

//handleCors(corsOptions);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.resolve(__dirname, "../stat-tracker/build")));

//PATH CONFIGURATION TO RESPOND TO A REQUEST TO STATIC ROUTE REQUEST BY SERVING index.html
app.get("/Forgot/**", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../stat-tracker/build/index.html"));
});

//app.use(flash())
var PostgreSqlStore = require("connect-pg-simple")(session);

var conString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5433/TrackerData";

var conObject = {
    connectionString: conString+'?ssl=true',
    ssl: { rejectUnauthorized: false },
  };


app.use(
  session({
    store: new PostgreSqlStore({ conObject }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
