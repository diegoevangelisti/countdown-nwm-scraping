const express = require("express");
const router = express.Router();

//Landing page
router.get("/", (req, res, next) => {
    res.render("../views/landing.ejs");
});

module.exports = router;