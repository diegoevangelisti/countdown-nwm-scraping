var express = require("express");
var app = express();
const cron = require("node-cron");

app.set("view engine", "ejs");

//
// Routes
//

app.get("/categories", function(req, res) {
  const categories = require("./json/categories.json");
  res.render("categories/index", { categories: categories });
});

app.get("/products", function(req, res) {
  const products = require("./json/categories/" + req.query.category_id);
  const categories = require("./json/categories.json");
  res.render("products/index", { products: products, categories: categories});
});

app.get("/scrap", async function(req, res) {
  const { scrapCategories } = require("./categories.js");
  const cat_url = "https://shop.countdown.co.nz/shop/";

  try {
    console.log("Importing categories");
    const categories = await scrapCategories(cat_url);

    const { scrapProducts } = require("./products.js");
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
cron.schedule("* 1 * * *", async function() {
  const { scrapCategories } = require("./categories.js");
  const cat_url = "https://shop.countdown.co.nz/shop/";

  const scrappedCategories = await scrapCategories(cat_url);
  console.log("Importing categories");
});

cron.schedule("* 1 * * *", async function() {
  const { scrapProducts } = require("./products.js");
  const scrappedProducts = await scrapProducts();
  res.send("SAVED TO JSON");
  console.log("Importing products");
});

app.listen(process.env.PORT || 5000, async function() {
  console.log("listening on port " + (process.env.PORT || 5000));
});
