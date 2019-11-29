const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017";


app.set('view engine', 'pug');

app.use(express.static('file'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, client) {
    if (err) throw err;
    const db = client.db('arduino');



    app.get('/getDataChart', (req, res, next) => {
        db.collection('data').find().limit(50).sort({
            _id: -1
        }).toArray(function (err, data) {
            res.send(data);
            res.end();
        })
    })

    app.get('/getCurentData', (req, res, next) => {
        db.collection('data').find().limit(50).sort({
            _id: -1
        }).toArray(function (err, data) {
            res.send(data);
            res.end();
        })
    })

    app.get('/', function (req, res) {
        res.redirect('/home');
        res.end();
    });

    app.get('/home', function (req, res) {
        res.render('home', {})

        app.get('/getData', (req, res) => {
            let data = {
                dht22_t: Number(req.query.dht22_t),
                dht22_h: Number(req.query.dht22_h),
                gy68_t: Number(req.query.gy68_t),
                gy68_p: Number(req.query.gy68_p),
                createdTime: Date.now()
            }
            // console.log(data)
            db.collection("data").insertOne(data, function (err, result) {
                if (err) console.log("loi");
                console.log("1 document inserted");
                res.send('ok')
                res.end();
            });
        });
    })

    const server = app.listen(3000, (err) => {
        if (err) throw err;
        const host = server.address().address;
        const port = server.address().port;

        console.log("Example app listening at http://%s:%s", host, port);
    });
});

