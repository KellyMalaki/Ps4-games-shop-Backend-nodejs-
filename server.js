var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var db = mongoose.connect("mongodb://127.0.0.1/games-shop");
var Game = require("./modules/game");

app.use(cors());
const{ createProxyMiddleware} = require("http-proxy-middleware");
app.use("/api", createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    onProxyRes: function(proxyRes, req, res){
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Now we start cover stuff
require("dotenv").config();
const upload = require('./image-files/routes/upload');
const Grid = require("gridfs-stream");
const connection = require("./image-files/db");

let gfs;
let gridFSBucket;
connection();

const conn = mongoose.connection;
conn.once("open", function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'game-cover-images'
      });
    
    gfs.collection("game-cover-images");
})

app.use("/covers", upload);


//media routes
app.get('/covers/:filename', async(req, res) =>{
    try {
        const file = await gfs.files.findOne({filename: req.params.filename});
        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        res.send("File not found");
        console.log(`File error is ${error}`);
    }
});


app.delete("/covers/:filename", async(req, res) =>{
    try {
        await gfs.files.deleteOne({filename: req.params.filename});
        res.send("success");
    } catch (error) {
       console.log(error);
       res.send("An error occurred.");
    }
})


//No more covers stuff

app.listen(4000, function(){
    console.log("Backend server is running...");
});

app.get("/games", function(req, res){
    Game.find({}, function(err, theGames){
        if(err){
            res.status(500).send({error: "Could not fetch the data"});
        }else{
            res.send(theGames);
        }
    });
});

app.post("/games/upload", function(req, res){
    var game = Game(req.body);

    game.save(function(err, savedGame){
        if(err){
            res.status(500).send({error: "Could not save product"});
        }else{
            res.send(savedGame);
        };
});
});