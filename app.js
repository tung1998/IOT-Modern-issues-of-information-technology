const express = require('express');
const app = express();

const cookie = require('cookie');
const md5 = require('md5');

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

    app.post('/getData', (req, res, next) => {
        db.collection('data').find().limit(50).sort({
            _id: -1
        }).toArray(function (err, data) {
            res.send(data);
            res.end();
        })
    })

    app.get('/user', function (req, res) {
        var cookies = cookie.parse(req.headers.cookie || '');
        // console.log(req.headers.cookie);
        console.log(cookies);
        if (!cookies.name) {
            res.redirect('/home');
        } else {
            db.collection("user").find(cookies).toArray(function (err, result) {
                console.log(result);
                if (result.length) {
                    db.collection('data').find().limit(5).sort({
                        _id: -1
                    }).toArray(function (err, data) {
                        res.render('user', {
                            data: data
                        });
                    })
                } else res.redirect('/home');
            })
        }
    })

    app.get('/', function (req, res) {
        res.redirect('/home');
        res.end();
    });

    app.post('/logout', (req, res, next) => {
        res.clearCookie("name");
        res.send('success');
    })


    app.get('/register', function (req, res) {
        res.render('registerPage');
        res.end();
        // console.log(req.headers.cookie);
        // console.log(cookies.name);

    });
    app.get('/login', function (req, res) {
        var cookies = cookie.parse(req.headers.cookie || '');
        // console.log(req.headers.cookie);
        // console.log(cookies.name);
        if (!cookies.name) {
            res.render('loginPage');
        } else {
            db.collection("user").find(cookies).toArray(function (err, result) {
                // console.log(result);
                if (result.length) {
                    res.redirect('/user');
                } else res.render('loginPage');
            })
        }
    });

    app.post('/register', (req, res) => {
        var data = req.body;
        console.log(data);
        data.name = md5(data.username + data.password);
        db.collection("user").insertOne(data, function (err, result) {
            if (err) console.log("loi");
            console.log("1 document inserted");
            res.send('1');
            res.end();
        });
    });


    app.post('/login', function (req, res) {
        var data = req.body
        console.log(data);
        db.collection("user").find(data).toArray(function (err, result) {
            if (err) throw err;
            if (result.length) {
                res.setHeader('Set-Cookie', cookie.serialize('name', result[0].name, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }));
                res.send('1');
                res.end();
            } else res.send('0');
        })
    });

    app.get('/home', function (req, res) {
        var cookies = cookie.parse(req.headers.cookie || '');
        // console.log(req.headers.cookie);
        // console.log(cookies.name);
        db.collection('data').find().limit(1).sort({
            _id: -1
        }).toArray(function (err, data) {

            if (!cookies.name) {
                res.render('home', {
                    data: data
                });
            } else {
                db.collection("user").find(cookies).toArray(function (err, result) {
                    // console.log(result);
                    if (result.length) {
                        res.redirect('/user');
                    } else res.render('home', {
                        data: data
                    });
                })
            }
        })

    })


    app.get('/getData', (req, res) => {
        let data = {
            dht22_t:Number(req.query.dht22_t),
            dht22_h:Number(req.query.dht22_h),
            gy68_t:Number(req.query.gy68_t),
            gy68_p:Number(req.query.gy68_p),
            createdTime: Date.now()
        }
        db.collection("data").insertOne(data, function (err, result) {
            if (err) console.log("loi");
            console.log("1 document inserted");
            res.send('lolololo')
            res.end();
        });
    });




    const server = app.listen(3000, (err) => {
        if (err) throw err;
        const host = server.address().address;
        const port = server.address().port;

        console.log("Example app listening at http://%s:%s", host, port);
    });



});