"use strict";

const express = require("express"),
      router = express.Router(),
      Article = require("../models/article");

router.get("/", function(req, res) {
    Article
        .find({})
        .where("saved").equals(false)
        .where("deleted").equals(false)
        .sort("-date")
        .limit(20)
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: "Welcome to News Article Scrape",
                    articles: articles
                };
                res.render("index", hbsObj);
            }
        });
});

router.get("/saved", function(req, res) {
    Article
        .find({})
        .where("saved").equals(true)
        .where("deleted").equals(false)
        .populate("notes")
        .sort("-date")
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: "Here's your saved article",
                    articles: articles
                };
                res.render("saved", hbsObj);
            }
        });
});
router.use("/api", require("./api"));


module.exports = router;
