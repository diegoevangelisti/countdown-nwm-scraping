const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category= require("../models/categories");

//Categories: Just get all products or get an specific products
//Not allow to add, edit or delete scraped products


//Get all categories from database
router.get("/", (req, res, next) => {
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


  //const categories = require("./json/categories.json");
  //res.render("categories/index", { categories: categories });
});


//GET an specific category from database
router.get("/:categoryId", (req, res, next) => {
    const id = req.params.categoryId;
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