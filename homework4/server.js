const path = require('path');
const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const getNews = require('./news');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    getNews((news) => {
        const newsCount = news.length;
        const obj = {item: null};
        const num = parseInt(req.body.itemNumber);
        if (num >= 1 && num <= newsCount) {
            obj.item = news[num - 1];
        }
        res.send(JSON.stringify(obj));
    });
    
});

app.listen(8888, () => {
    console.log('Server started...');
});
