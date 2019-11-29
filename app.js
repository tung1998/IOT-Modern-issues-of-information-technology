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
        let curentDate = Math.ceil(Date.now() / (3600000))* 3600000
        let data = []
        db.collection('data').find({}).sort({
            _id: 1
        }).toArray(function (err, result) {
            for (let i = 0; i < 161; i++) {
                data.push(result.filter(item => item.createdTime >= curentDate - (i + 0.5) * 3600000 && item.createdTime <= curentDate - (i - 0.5) * 3600000))
            }
            let sendData = data.map((dataInDate, index) => {
                dataInDateData = dataInDate.reduce((acc, cur) => {
                    if (!isNaN(cur.dht22_t)) acc.dht22_t += cur.dht22_t
                    if (!isNaN(cur.dht22_h)) acc.dht22_h += cur.dht22_h
                    if (!isNaN(cur.gy68_t)) acc.gy68_t += cur.gy68_t
                    if (!isNaN(cur.gy68_p)) acc.gy68_p += cur.gy68_p
                    return acc
                }, {
                    dht22_t: 0,
                    dht22_h: 0,
                    gy68_t: 0,
                    gy68_p: 0,
                    createdTime: `${curentDate-(index+1)*3600000}`
                })
                return {
                    dht22_t: (dataInDateData.dht22_t / dataInDate.length).toFixed(2),
                    dht22_h: (dataInDateData.dht22_h / dataInDate.length).toFixed(2),
                    gy68_t: (dataInDateData.gy68_t / dataInDate.length).toFixed(2),
                    gy68_p: (dataInDateData.gy68_p / dataInDate.length).toFixed(2),
                    createdTime: curentDate - (index + 1) * 3600000
                }
            })
            // console.log(data)
            res.send(sendData);
            res.end();
        })
    })

    app.get('/getLastData', (req, res, next) => {
        db.collection('data').find().limit(1).sort({
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


function getDataByTime(db, startTime, endTime) {
    return new Promise((resolve, reject) => {
        db.collection('data').find({
            createdTime: {
                $gt: startTime,
                $lt: endTime
            }
        }).sort({
            _id: 1
        }).toArray(function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}