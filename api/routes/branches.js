const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Branch = require("../models/branches");
const Shop = require("../models/shops");

//Branches: Just get all products or get an specific products


//GET - all branches from database
router.get("/", (req, res, next) => {
    Branch.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: 'No branch found'
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

//GET an specific branch from database

router.get("/:branchId", (req, res, next) => {
    const id = req.params.branchId;
    Branch.findById(id)
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

//POST - Add new Branch

router.post("/", (req, res, next) => {

    //Check if the shop_id is correct first
    Shop.findById(req.body.shop_id)
        .then(shop => {
            if (!shop) {
                return res.status(404).json({
                    message: "Shop not found"
                });
            }
            const branch = new Branch({
                _id: Math.random()
                    .toString(36)
                    .substr(2, 9),
                shop_id: req.body.shop_id,
                branch_name: req.body.branch_name,
                address: req.body.address,
                lat: req.body.lat,
                long: req.body.long
                
            });
            return branch.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Handling POST requests to /branch",
                        createdBranch: result
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
//PATCH - Update an specific Branch

router.patch("/:branchId", (req, res, next) => {
    const id = req.params.branchId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Branch.update({
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

//DESTROY - Delete an specific Branch

router.delete("/:branchId", (req, res, next) => {
    const id = req.params.branchId;
    Branch.remove({
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