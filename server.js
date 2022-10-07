const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require("path")
const mongodb = require('mongodb')
const fs = require('fs')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadImage')
    },
    filename: (req, file, cb) => {
        cb(null, file.myfile + "-" + Date.now())
    }
})

var upload = multer({
    storage: storage
})

var MongoClient = mongodb.MongoClient;
MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err)
        return console.log(err);

    db = client.db('images')
    app.listen(3000, () => {
        console.log("mongo server is running at 3000 ")

    })

})



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/upload', upload.single('myfile'), (req, res, next) => {
    const img = fs.readFileSync(req.file.path)
    // let encode_image = img.toString("base64");

    var finalimg = {
        contentType: req.file.mimetype,
        path: req.file.path,
        imag: img
    };

    db.collection('images').insertOne(finalimg, (err, result) => {
        console.log(result)


        if (err)
            return console.log(err)

        console.log("saved to databse")
        res.contentType(finalimg.contentType)
        res.send(finalimg.imag);
    })

})

app.listen(5000, () => {
    console.log("server is running")
})