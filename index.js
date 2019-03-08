var express = require("express");
var app = express();
const cron = require("node-cron");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');


app.set("view engine", "ejs");



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

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

app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/users', usersRoutes);
app.use('/lists', listsRoutes);
app.use('/shops', shopsRoutes);
app.use('/branches', branchesRoutes);
app.use('/scrap', scrapingRoutes);



app.get("/scrap", async function (req, res) {
  const {
    scrapCategories
  } = require("./categories.js");
  const cat_url = "https://shop.countdown.co.nz/shop/";

  try {
    console.log("Importing categories");
    const categories = await scrapCategories(cat_url);

    const {
      scrapProducts
    } = require("./products.js");
    console.log("Importing products");
    await scrapProducts(categories);
    res.send("PROCESSING");

  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

//
// Jobs
//
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

app.listen(process.env.PORT || 5000, async function () {
  console.log("listening on port " + (process.env.PORT || 5000));
});

//MONGO ATLAS DATABASE

// mongoose.connect('mongodb+srv://diego-re:' + process.env.MONGO_ATLAS_PW +
//   '@cluster0-y9ijb.mongodb.net/test?retryWrites=true');

//MLAB HEROKU

mongoose.connect("mongodb://diego-re:diego1985@ds163255.mlab.com:63255/heroku_1b4h2b5x");



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
module.exports = app;