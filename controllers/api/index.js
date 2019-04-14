"use strict";
const express = require("express"),
      router = express.Router(),
      request = require("request"),
      cheerio = require("cheerio"),
      Article = require("../../models/article"),
      Note = require("../../models/note");


router.get("/", function(req, res){

    res.render("api")
})

router.use("/articles", require("./articles"));
router.use("/notes", require("./notes"));

module.exports = router;
