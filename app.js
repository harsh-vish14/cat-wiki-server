require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const url = process.env.URL
const setting = { method: "GET" }


app.get('/breeds', (req, res) => {
    fetch(`${url}/breeds`, setting)
    .then(res => res.json())
        .then((json) => {
            
            res.json(json);
        })
        .catch((err) => {
        res.redirect('/invalid-param')
    })
});

app.get('/catInfo/:id', (req, res) => {
    // https://api.thecatapi.com/v1
    fetch(`${url}/breeds/search?q=${req.params.id}`, setting)
    .then(res => res.json())
        .then((json) => {
            res.json(json);
        }).catch((err) => {
        res.redirect('/invalid-param')
    })
})

app.get('/images/:id', (req, res) => {
    var urls = []
    fetch(`${url}/images/search?breed_id=${req.params.id}&limit=9`)
        .then((res) => res.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                urls.push(json[i].url)
            }
        })
        .then(() => {
            res.json(urls)
        })
        .catch((err) => {
        res.redirect('/invalid-param')
    })
})

app.get('/breeds/list', (req, res) => {
    var datafilter = []
    fetch(`${url}/breeds`, setting)
        .then(res => res.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                datafilter.push({
                    name: json[i].name,
                    url: json[i].image,
                    description: json[i].description
                })
            }
            
        }).then(() => {
            res.json(datafilter);
        })
        .catch((err) => {
        res.redirect('/invalid-param')
    })
});

app.get('/invalid-param', (req, res) => {
    res.json({
        message:  'InValid Parameters'
    })
})

app.get('*', (req, res) => {
    res.json({
        status: 404,
        
        message: 'Invalid API'
    })
})

app.listen((process.env.PORT || 8000), (req, res) => {
    console.log('server is running on port 8000');
})