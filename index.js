var express = require("express");
var app = express();
var passport = require("passport");
var User = require("./api/models/users");
var LocalStrategy = require("passport-local");
var PassportLocalMongoose = require("passport-local-mongoose");
const cron = require("node-cron");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

//ejs view
app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(require("express-session")({
  secret: "My dear Gandalf from The Lord of the Rings",
  resave: false,
  saveUninitialized: false
}));


//Seting Passport up
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//
// Routes
//

const productsRoutes = require('./api/routes/products');
const categoriesRoutes = require('./api/routes/categories');
const usersRoutes = require('./api/routes/users');
const listsRoutes = require('./api/routes/lists');
const shopsRoutes = require('./api/routes/shops');
const branchesRoutes = require('./api/routes/branches');
const scrapingRoutes = require('./api/routes/scrap');
const landingRoutes = require('./api/routes/landing');
const optionsRoutes = require('./api/routes/options');
const authRoutes = require('./api/routes/auth');
const locationsRoutes = require('./api/routes/locations');



app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/users', usersRoutes);
app.use('/lists', listsRoutes);
app.use('/shops', shopsRoutes);
app.use('/branches', branchesRoutes);
app.use('/scrap', scrapingRoutes);
app.use('/', landingRoutes);
app.use('/locations', locationsRoutes);
app.use('/options', optionsRoutes);
app.use('/auth', authRoutes);




app.listen(process.env.PORT || 5000, async function () {
  console.log("listening on port " + (process.env.PORT || 5000));
});


//MLAB HEROKU
mongoose.connect("mongodb://diego:diego1234@ds245234.mlab.com:45234/heroku_44n62dw0", {useNewUrlParser: true})


//MONGO ATLAS DATABASE
// mongoose.connect('mongodb+srv://diego-re:' + process.env.MONGO_ATLAS_PW +
//   '@cluster0-y9ijb.mongodb.net/test?retryWrites=true');

//LOCAL HOSTING
//mongoose.connect("mongodb://localhost/SSA");


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);

});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

//
// Jobs
//
/*
cron.schedule("* 1 * * *", async function () {
  const {
    scrapCategories
  } = require("./categories.js");
  const cat_url = "https://shop.countdown.co.nz/shop/";

  const scrappedCategories = await scrapCategories(cat_url);
  console.log("Importing categories");
});

cron.schedule("* 1 * * *", async function () {
  const {
    scrapProducts
  } = require("./products.js");
  const scrappedProducts = await scrapProducts();
  res.send("SAVED TO JSON");
  console.log("Importing products");
});
*/
module.exports = app;