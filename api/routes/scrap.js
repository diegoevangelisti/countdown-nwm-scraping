// External dependencies
const express = require("express");
const router = express.Router();
const Category = require("../models/categories");
const Product = require("../models/products");
const axios = require("axios");
const cheerio = require("cheerio");

//countdown and NWM on line shopping web-site index page
const cat_url = "https://shop.countdown.co.nz/shop/";
const cat_url_nwm = "https://www.ishopnewworld.co.nz/";

//Scarping data from Countdown
router.post("/countdown", async function (req, res) {
    scrapeCat = async cat_url => {
        const response_countdown = await axios.get(cat_url);
        const $ = cheerio.load(response_countdown.data);

        // add slice(0,2) before map to just get 2 categories
        $("#BrowseSlideBox a.toolbar-slidebox-link").map((item, el) => {
            category_url = "https://shop.countdown.co.nz" + $(el).attr("href");
            var count = item;
            const category_n = $(el)
                .text()
                .trim();

            //Add category directly to database
            const category = new Category({
                _id: Math.random().toString(36).substr(2, 9),
                shop_id: "y6ssalsn6",
                category_name: category_n,
                url: category_url,
                last_update: new Date().toLocaleString()
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
            //scraping products here
            const scrapProd = async category => {
                let pageCounter = 0;
                let pageLimit = 5;
                const url = category.url + "?page=" + pageCounter;
                const response_p_c= await axios.get(url);

                const $ = cheerio.load(response_p_c.data);

                //pageLimit disable. Now scraping just 5 pages per category
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
                        var img_url = null;
                        const name = $(el)
                            .find("h3.gridProductStamp-name")
                            .text()
                            .trim();
                        var normal_p = $(el)
                            .find("div.gridProductStamp-price.din-medium")
                            .text()
                            .trim();
                        img_url = "https://shop.countdown.co.nz" + $(el)
                            .find("img.gridProductStamp-image")
                            .attr("src");

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
                            shop_id: "y6ssalsn6",
                            category_id: category._id,
                            product_name: name,
                            product_price: {
                                normal_price: normal_price,
                                offer_price: offer_price
                            },
                            measure_unit: unit,
                            image_url: img_url,
                            url: pageUrl,
                            last_update: new Date().toLocaleString()
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

//Scarping data from New World Metro
router.post("/nwm", async function (req, res) {
    scrapeCatNWM = async cat_url_nwm => {
        const response = await axios.get(cat_url_nwm);
        const $ = cheerio.load(response.data);

        // Add slice(0,2).map(...) to just get 2 categories
        $("a.fs-home-category-tiles__tile").map((item, el) => {
            category_url = "https://www.ishopnewworld.co.nz" + $(el).attr("href");
            var count = item;
            const category_n = $(el).children("span").text()

            //Add category directly to database
            const category = new Category({
                _id: Math.random()
                    .toString(36)
                    .substr(2, 9),
                category_name: category_n,
                shop_id: "7i9jnzypf",
                url: category_url,
                last_update: new Date().toLocaleString()
            });
            category
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Handling POST requests to /categories",
                        createdCategory: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            //scraping products here
            const scrapProdNWM = async category => {
                let pageCounterNWM = 0;
                let pageLimitNWM = 5;
                const url = category.url + "?pg=" + (pageCounterNWM + 1)
                const response_p = await axios.get(url)

                const $ = cheerio.load(response_p.data)
                
                //pageLimit disable. Now scraping just 5 pages per category
                /* pageLimit = $("ul.fs-pagination__items.u-margin-bottom-x4")
                   .find("li.fs-pagination__item")
                   .last()
                   .attr("a")
                   .text()
                   .trim();*/
                const pagesNWM = await Promise.all(
                    [...Array(parseInt(pageLimitNWM))].map(async (item, i) => {
                        const p = i + 1
                        const pageUrl = category.url + "?pg=" + p;
                        const response = await axios.get(pageUrl)
                        console.log(
                            `Processing ${category.category_name}: ${p} out of ${pageLimitNWM}`
                        );
                        if (response.status !== 200) {
                            return null;
                        }
                        return parsePaNWM(response, category, pageUrl);
                    })
                );
            };
            function parsePaNWM(response, category, pageUrl) {
                //Scraping products
                const $ = cheerio.load(response.data)
                return $("div.fs-product-card")
                    .map((i, el) => {
                        //var normal_p = null ;
                        var measure_u = null
                        var normal_price = $(el)
                            .find("div.js-product-card-footer.fs-product-card__footer-container")
                            .attr("data-options")
                        normal_price = normal_price.replace(/[\r\n]/g, '')
                        var price = JSON.parse(normal_price);
                        normal_price = price.ProductDetails.PricePerItem
                        const name = $(el)
                            .children("a.fs-product-card__details.u-color-black.u-no-text-decoration.u-cursor")
                            .children("div.fs-product-card__description")
                            .find("h3.u-p2")
                            .text()
                            .trim()
                        measure_u = $(el)
                            .children("a.fs-product-card__details.u-color-black.u-no-text-decoration.u-cursor")
                            .children("div.fs-product-card__description")
                            .find("p.u-color-half-dark-grey.u-p3")
                            .text()
                        var img_url = $(el)
                            .find("div.fs-product-card__product-image")
                            .css('background-image')
                        //to clean the image url   
                        img_url = img_url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')
                        //SAVE new product here
                        const product = new Product({
                            _id: Math.random()
                                .toString(36)
                                .substr(2, 9),
                            shop_id: "7i9jnzypf",
                            category_id: category._id,
                            product_name: name,
                            product_price: {
                                normal_price: normal_price,
                                offer_price: null,
                            },
                            measure_unit: measure_u,
                            url: pageUrl,
                            image_url: img_url,
                            last_update: new Date().toLocaleString()
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
                                })
                            })
                    })
                    .get()
            }
            scrapProdNWM(category)
        });
    };
    await scrapeCatNWM(cat_url_nwm)
})

module.exports = router;