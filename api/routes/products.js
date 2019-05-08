const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/products");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("./auth/login");
}



//get products by category_id and render a page

router.get("/", isLoggedIn, (req, res, next) => {
    Product.find({
            category_id: req.query.category_id,
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

//GET all products in json format

router.get("/all", (req, res, next) => {
    Product.find()
        .exec()
        .then(doc => {
            console.log("All products", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: "Error in getting all products"
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


//GET an specific product by ID


router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
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
});

//get all NW products in json format

router.get("/json/nwm", (req, res, next) => {
    Product.find( {shop_id: "7i9jnzypf"})
    .exec()
    .then(doc => {
        console.log("NWM products in json format", doc);
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
});

//get all Countdown products in json format

router.get("/json/countdown", (req, res, next) => {
    Product.find( {shop_id: "y6ssalsn6"})
        .exec()
        .then(doc => {
        console.log("COUNTDOWN products in json format", doc);
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
});


module.exports = router;