const express = require("express");
const router = express.Router();

//Landing page
router.get("/", isLoggedIn,  (req, res, next) => {
    res.render("../views/locations");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("./auth/login");
}

module.exports = router;
