const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Category= require("../models/categories");

router.get("/", async function(req,res){
    res.render("options/index");
});

router.delete("/deleteall", async function(req,res){
    Category
    .find()
    .remove()
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
    Product
    .find()
    .remove()
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