const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category= require("../models/categories");

//Categories: Just get all products or get an specific products
//Not allow to add, edit or delete scraped products

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("./auth/login");
}

//Get all categories from database and render a view page
router.get("/", isLoggedIn,(req, res, next) => {
    Category.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
              res.render("categories/index", {docs: docs});
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


//GET all categories in json format
router.get("/all", (req, res, next) => {
    Category.find()
        .exec()
        .then(doc => {
            console.log("All categories", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: "Error in getting all categories"
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

router.get("/all/countdown", (req, res, next) => {
    Category.find( {shop_id: "y6ssalsn6"})
        .exec()
        .then(docs=> {
            console.log(docs);
            if (docs.length >= 0) {
              res.render("categories/index_countdown", {docs: docs});
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

router.get("/json/countdown", (req, res, next) => {
    Category.find( {shop_id: "y6ssalsn6"})
        .exec()
        .then(doc => {
        console.log("COUNTDOWN categories in json format", doc);
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

router.get("/all/nwm", (req, res, next) => {
    Category.find( {shop_id: "7i9jnzypf"})
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
              res.render("categories/index_nwm", {docs: docs});
    
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
    Category.find( {shop_id: "7i9jnzypf"})
    .exec()
    .then(doc => {
        console.log("NWM categories in json format", doc);
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


//GET an specific category from database
router.get("/:category_id", (req, res, next) => {
    const id = req.params.category_id;
    Category.findById(id)
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