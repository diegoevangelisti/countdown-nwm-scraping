const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/products");

//Products: Just get all products or get an specific products

//Get all products from a specific category

router.get("/", (req, res, next) => {
Product.find({
    category_id: req.query.category_id
})
.then(docs => {
    console.log(docs);
    if (docs.length >= 0) {
        res.render("products/index", {
            docs: docs
        });
    } else {
        res.status(404).json({
            message: 'No entries found'
        });
    }
})
.catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
});

})


//GET an specific product from database


router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;