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

//TEXT SEARCH

router.get("/search", (req, res, next) => {
    Product.find({
            $text: {
                $search: "Bread"
            },
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


//GET an specific product 


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