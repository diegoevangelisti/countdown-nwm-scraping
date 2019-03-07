const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/scrap");
const Product = require("../models/scrap");


router.post("/", (req, res, next) => {
    const categories = require("../../json/categories.json");
    // const products = require(".json/categories/");

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
    });
});

module.exports = router;