const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Category= require("../models/categories");
var methodOverride = require('method-override');
router.use(methodOverride('_method'));


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("./auth/login");
}


router.get("/", isLoggedIn, async function(req,res){
    res.render("options/index");
});

router.delete("/countdown", async function(req,res){
    Category
    .find( { shop_id: "y6ssalsn6"} )
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
    .find( { shop_id: "y6ssalsn6"} )
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
router.delete("/nwm", async function(req,res){
    Category
    .find( { shop_id: "7i9jnzypf"} )
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
    .find( { shop_id: "7i9jnzypf"} )
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