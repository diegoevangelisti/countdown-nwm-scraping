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

const cat_url = "https://shop.countdown.co.nz/shop/";

//scraping directly in the database

router.post("/direct", async function (req, res) {

    scrapeCat = async cat_url => {
        const response = await axios.get(cat_url);
        const $ = cheerio.load(response.data);

        // slice(0,2) to just scrape two categories
        $("#BrowseSlideBox a.toolbar-slidebox-link").map((item, el) => {
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

        });
    };
    await scrapeCat(cat_url);

})


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
