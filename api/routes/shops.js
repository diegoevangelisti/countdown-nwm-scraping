const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Shop = require("../models/shops");

//Shops: Just get all products or get an specific products

//GET - all shops from database
router.get("/", (req, res, next) => {
    Shop.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: 'No shops found'
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


//GET an specific shop from database

router.get("/:shopId", (req, res, next) => {
    const id = req.params.shopId;
    Shop.findById(id)
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


// POST - Add a new shop

router.post("/", (req, res, next) => {
    const shop = new Shop({
        _id: Math.random()
            .toString(36)
            .substr(2, 9),
        shop_name: req.body.shop_name
    });
    shop
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /shop",
                createdShop: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//PATCH - Update an specific Shop

router.patch("/:shopId", (req, res, next) => {
    const id = req.params.shopId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Shop.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//DESTROY - Delete an specific Shop

router.delete("/:branchId", (req, res, next) => {
    const id = req.params.shopId;
    Shop.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;