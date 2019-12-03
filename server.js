var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds351628.mlab.com:51628/heroku_43kv6nkk";

mongoose.connect(MONGODB_URI);

mongoose.connect("mongodb://localhost/movienews", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://screenrant.com/movie-news/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("h3.bc-title").each(function(i, element) {
            var result = {};

            result.headline = $(this).find("a").text();
            result.summary = $(this).find("body > div.w-website > div.w-content > main > section > div.w-browse-clip > article:nth-child(2) > div > p");
            result.link = "https://screenrant.com" + $(this).find("a").attr("href");

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
        });

        res.send("Scrape Complete!");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
})