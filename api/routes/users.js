const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");

//Users: Get all, get by specific ID, create, update, destroy


//Get - Obtain all users from database
router.get("/", (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
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


//GET - Obtain an specific user from database

router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
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

//POST - Add new user

router.post("/", (req, res, next) => {
    const user = new User({
        _id: Math.random()
            .toString(36)
            .substr(2, 9),
        user_name: req.body.user_name,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender,
        nationality: req.body.nationality,
        email: req.body.email,
        contact_number: req.body.contact_number
    });
    user
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /users",
                createdUser: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//PATCH - Update an specific user

router.patch("/:userId", (req, res, next) => {
    const id = req.params.user_id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({
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

//DESTROY - Delete an specific user

router.delete("/:userId", (req, res, next) => {
    const id = req.params.user_id;
    User.remove({
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