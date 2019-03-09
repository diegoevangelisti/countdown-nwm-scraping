// External dependencies
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/categories");
const Product = require("../models/products");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const chalk = require("chalk");
const _ = require("lodash");

const cat_url = "https://shop.countdown.co.nz/shop/";


//scraping directly in the database
router.post("/direct", async function (req, res) {
    scrapeCat = async cat_url => {
        const response = await axios.get(cat_url);
        const $ = cheerio.load(response.data);

        // slice(0,2) to just scrape two categories
        $("#BrowseSlideBox a.toolbar-slidebox-link").slice(0, 3).map((item, el) => {
            category_url = "https://shop.countdown.co.nz" + $(el).attr("href");
            var count = item;
            const category_n = $(el)
                .text()
                .trim();

            //Add category directly to database
            const category = new Category({
                _id: count,
                category_name: category_n,
                url: category_url
            });
            category
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Handling POST requests to /categories",
                        createdList: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            //
            //scraping products here
            //
            const scrapProd = async category => {
                let pageCounter = 0;
                let pageLimit = 1;
                const url = category.url + "?page=" + pageCounter;
                const response_p = await axios.get(url);

                const $ = cheerio.load(response_p.data);
                /*pageLimit = $("ul.paging.pull-left.hidden-phone")
                  .find("li.page-number")
                  .last()
                  .find("a._jumpTop")
                  .text()
                  .trim();*/

                const pages = await Promise.all(
                    [...Array(parseInt(pageLimit))].map(async (item, i) => {
                        const p = i + 1;
                        const pageUrl = category.url + "?page=" + p;
                        const response = await axios.get(pageUrl);
                        console.log(
                            `Processing ${category.category_name}: ${i} out of ${pageLimit}`
                        );
                        if (response.status !== 200) {
                            return null;
                        }

                        return parsePa(response, category, pageUrl);
                    })
                );
            };

            function parsePa(response, category, pageUrl) {
                //Scraping products
                const $ = cheerio.load(response.data);

                return $("div.gridProductStamp-product")
                    .map((i, el) => {
                        var offer_p = (offer_price = null);
                        let unit = null;

                        const name = $(el)
                            .find("h3.gridProductStamp-name")
                            .text()
                            .trim();
                        var normal_p = $(el)
                            .find("div.gridProductStamp-price.din-medium")
                            .text()
                            .trim();

                        if (normal_p != "") {
                            normal_price = (normal_p.replace(/\D+/g, "") / 100).toFixed(2);
                        } else {
                            if (normal_p == "") {
                                offer_p = $(el)
                                    .find("span.gridProductStamp-price.savings-text.din-medium")
                                    .text()
                                    .trim();
                                normal_p = $(el)
                                    .find("span.gridProductStamp-subPrice")
                                    .text()
                                    .trim();
                                offer_price = (offer_p.replace(/\D+/g, "") / 100).toFixed(2);
                                normal_price = (normal_p.replace(/\D+/g, "") / 100).toFixed(2);
                            }
                        }
                        //SAVE new product here
                        const product = new Product({
                            _id: Math.random()
                                .toString(36)
                                .substr(2, 9),
                            category_id: category._id,
                            product_name: name,
                            product_price: {
                                normal_price: normal_price,
                                offer_price: offer_price
                            },
                            measure_unit: unit,
                            url: pageUrl
                        })
                        product
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "Handling POST requests to /products",
                                    createdProduct: result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    })
                    .get();
            }
            scrapProd(category);
        });
    };
    await scrapeCat(cat_url);

})

//to scrape and save json files
 router.get("/", async function (req, res) {
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


router.post("/", async function (req, res) {
    try {
        const categories = require("../../json/categories.json");
        categories.map((newCategory) => {
            const category = new Category({
                _id: newCategory.category_id,
                category_name: newCategory.category_name,
                url: newCategory.url
            });
            category
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Handling POST requests to /categories",
                        createdList: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            const products = require("../../json/categories/" + newCategory.category_id + ".json");
            products.map((newProduct) => {
                const product = new Product({
                    _id: newProduct.product_id,
                    category_id: newProduct.category_id,
                    product_name: newProduct.product_name,
                    product_price: {
                        normal_price: newProduct.product_price.normal_price,
                        offer_price: newProduct.product_price.offer_price
                    },
                    measure_unit: newProduct.measure_unit,
                    url: newProduct.url
                })
                product
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "Handling POST requests to /products",
                            createdProduct: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            });
        });
    } catch (e) {
        console.log(e);
        res.send(e);
    }
});

module.exports = router;