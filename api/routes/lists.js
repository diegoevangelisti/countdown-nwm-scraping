const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const List = require("../models/lists");

//Lists: Get all, get by specific ID, create, update, destroy


//Get - Obtain all lists from database
router.get("/", (req, res, next) => {
    List.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: 'No lists found'
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


//GET - Obtain an specific list from database

router.get("/:listId", (req, res, next) => {
    const id = req.params.listId;
    List.findById(id)
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

//POST - Add new list

router.post("/", (req, res, next) => {
    const list = new List({
        _id: Math.random()
        .toString(36)
        .substr(2, 9),
        list_name: req.body.list_name,
        date_created: new Date().toLocaleString(),
        date_updated: new Date().toLocaleString()
    });
    list
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

//PATCH - Update an specific list

router.patch("/:listId", (req, res, next) => {
    const id = req.params.listId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    List.update({
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

//DESTROY - Delete an specific list

router.delete("/:listId", (req, res, next) => {
    const id = req.params.listId;
    List.remove({
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