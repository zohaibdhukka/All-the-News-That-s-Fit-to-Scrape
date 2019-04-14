"use strict";
const express = require("express"),
      router = express.Router(),
      request = require("request"),
      cheerio = require("cheerio"),
      Article = require("../../models/article"),
      Note = require("../../models/note");

router.get("/scrape", function(req, res, next) {
    console.log("new article added")
    request("https://bbc.com/", function(error, response, html) {
        let $ = cheerio.load(html);
        let results = [];
        $(".media__title").each(function(i, e) {
            let title = $(this).children("a").text(),
                link = $(this).children("a").attr("href"),
                single = {};
            if (link !== undefined && link.includes("https") &&  title !== "") {
                single = {
                    title: title,
                    link: link
                };
                // create new article
                let entry = new Article(single);
                // save to database
                entry.save(function(err, doc) {
                    if (err) {
                        if (!err.errors.link) {
                            console.log(err);
                        }
                    } else {
                        console.log("new article added");
                    }
                });
            }
        });
        next();
    });
}, function(req, res) {
    res.redirect("/");
});

router.get("/", function(req, res) {
    Article
        .find({})
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

router.get("/saved", function(req, res) {
    Article
        .find({})
        .where("saved").equals(true)
        .where("deleted").equals(false)
        .populate("notes")
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

router.post("/save/:id", function(req, res) {
    Article.findByIdAndUpdate(req.params.id, {
        $set: { saved: true}
        },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect("/");
            }
        });
});


router.get("/deleted", function(req, res) {
    Article
        .find({})
        .where("deleted").equals(true)
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});



module.exports = router;
