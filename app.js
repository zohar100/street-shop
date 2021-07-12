//PACKAGES SETUP
var methodOverride = require("method-override"),
 LocalStrategy     = require("passport-local"),
 cookieParser      = require('cookie-parser'),
 bodyParser        = require("body-parser"),
 mongoose          = require("mongoose"),
 passport          = require("passport"),
 express           = require("express"),
 dotenv            = require("dotenv"),
 seeds             = require("./seeds"),
 flash             = require("connect-flash"),
 app               = express();
 //SCHEMA SETUP
 var User = require("./models/user");
 //ROUTES SETUP
 var commentRoutes  = require("./routes/comments"),
 indexRoutes    = require("./routes/index"),
 adminRoutes    = require("./routes/admins"),
 shopRoutes     = require("./routes/shop"),
 userRoutes     = require("./routes/users"),
 cartRoutes     = require("./routes/cart");
 
 //APP HELPERS
 dotenv.config();
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static(__dirname + "/public"));
 app.use(methodOverride("_method"));
 app.set("view engine", "ejs");
 app.use(flash());
 app.use(cookieParser())
 
 
 //DB CONFIGURATION
 var uri = process.env.MONGODB_URI;
 mongoose.connect(uri, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
  }); 
  var connection = mongoose.connection;
  connection.once("open", function(){
    console.log("MongoDB database connect");
  });

  seeds();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is secret thing",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MADE LOCALS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    app.locals.moment = require('moment');
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES CONFIGURATION
app.use(indexRoutes);
app.use(shopRoutes);
app.use(cartRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started!",);
});