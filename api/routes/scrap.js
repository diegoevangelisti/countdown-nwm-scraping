const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/categories");
const Product = require("../models/products");


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
                        message: "Handling POST requests to /lists",
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