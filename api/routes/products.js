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

//GET all categories in json format
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


//GET an specific product 


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



//TEST POR TEXT SEARCH


router.get("/", (req, res, next) => {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({
                product_name: req.query.seach
            })
            .exec()
            .then(docs => {
                console.log(docs);
                if (docs.length >= 0) {
                    res.render("products/index", {
                        docs: docs
                    }, {
                        noMatch: noMatch
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


    } else {
        Product.then(docs => {
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
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;