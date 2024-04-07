/** @format */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const Article = require("./models/Article");

// Connect to the online MongoDB cluster using mongoose
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5hx4y2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
        console.log("Connected successfully");
    })
    .catch((error) => {
        console.log("Error connecting to the DB ", error);
    });

const port = process.env.PORT || 4000;
app.use(express.json());
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

app.get("/hello", (req, res) => {
    // res.send('{ "data": "hello" }');
    res.json({ data: "hello" });
    console.log("hello");
});

app.post("/sayHi", (req, res) => {
    res.send({
        status: 200,
        data: req.body,
        age: req.query.age,
    });
    console.log(req.body);
    console.log("sayHi was called");
});

app.get("/schedule/new", (req, res) => {
    console.log("/schedule/new was called");
    res.send("schedule new");
});

app.post("/schedule/new", (req, res) => {
    console.log("post /schedule/new was called");
    res.send("posrt requset: schedule new");
});

app.get("/calc", (req, res) => {
    res.send("calculating");
    console.log("calculating");
});

app.get("/findSummation/:num1/:num2", (req, res) => {
    console.log(req.params);
    const sum = Number(req.params.num1) + +req.params.num2;

    res.send(`Reponse-sum: ${sum}`);
    console.log("sum: ", sum);
});

app.get("/reloading", (req, res) => {
    const name = "mahmoud";
    let arr = [];
    for (let i = 0; i < 100; i++) {
        arr.push(`Loading: ${i}%\n`);
    }
    // res.sendFile(__dirname + "/views/reloading.ejs");
    res.render("reloading.ejs", {
        name: name,
        counter: arr,
    });
    console.log("Requset method: GET, reloading page was called");
});

// ============= ARTICLES ENDPOINTS  =============
app.post("/articles", async (req, res) => {
    const newArticle = new Article();

    const artTitle = req.body.articleTitle;
    const artBody = req.body.articleBody;
    // res.send(artTitle + " - " + artBody);

    newArticle.title = artTitle;
    newArticle.body = artBody;
    newArticle.numberOfLikes = 0;
    await newArticle.save();

    res.json(newArticle);
    console.log("Requset method: POST, articles was called");
});

app.get("/articles", async (req, res) => {
    const articles = await Article.find();

    console.log(articles);
    res.json(articles);
    console.log("Requset method: GET, articles was called");
});

app.get("/articles/:articleId", async (req, res) => {
    const { articleId: id } = req.params;
    try {
        const article = await Article.findById(id);
        res.json(article);
    } catch (e) {
        console.log("Error while reading article of id", id);
        return res.json({
            message: `Error while reading article of id, ${id}`,
            error: e,
            status: 400,
        });
    }
    console.log(`Requset method: GET, article ${id} was called`);
});

app.delete("/articles/:articleId", async (req, res) => {
    const { articleId: id } = req.params;
    try {
        const article = await Article.findByIdAndDelete(id);
        res.json(article);
    } catch (e) {
        console.log("Error while deleting article of id", id);
        return res.json({
            message: `Error while deleting article of id, ${id}`,
            error: e,
            status: 400,
        });
    }
    console.log(`Requset method: delete, article ${id} was called`);
});

app.get("/showArticles", async (req, res) => {
    const articles = await Article.find();
    res.render("articles.ejs", {
        allArticles: articles,
    });
    console.log(articles);
    console.log(`Requset method: get, showArticles was called`);
});

// ============= NOT FOUND ENDPOINTS  =============

app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/views/pageNotFound.html");
    console.log(__dirname);
    console.log("Requset method: GET, 404 page was called");
});
app.post("/*", (req, res) => {
    res.sendFile(__dirname + "/views/pageNotFound.html");
    console.log("Requset method: POST, 404 page was called");
});
app.delete("/*", (req, res) => {
    res.sendFile(__dirname + "/views/pageNotFound.html");
    console.log("Requset method: DELETE ,404 page was called");
});
app.patch("/*", (req, res) => {
    res.sendFile(__dirname + "/views/pageNotFound.html");
    console.log("Requset method: PATCH ,404 page was called");
});

app.put("/*", (req, res) => {
    res.sendFile(__dirname + "/views/pageNotFound.html");
    console.log("Requset method: PUT ,404 page was called");
});

// ============= APP LISTEN  =============

app.listen(port, () => {
    console.log(`I am listening in port ${port}`);
});
