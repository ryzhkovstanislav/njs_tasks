const path = require('path');

const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const conf = require('./configs/main_conf.json');
const Task = require('./models/task');

mongoose.connect(`mongodb://${conf.host}/${conf.db}`);
const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    Task.find((err, tasks) => {
        const context = {tasks: tasks};
        res.render('index', context);
    });
});

app.post('/task/create/', (req, res) => {
    const message = req.body.message;
    const newTask = new Task({text: message});
    newTask.save(err => {
        res.redirect('/');
    });
});

app.post('/task/update/:id', (req, res) => {
    const message = req.body.updated;
    Task.findByIdAndUpdate(req.params.id, {text: message}, err => {
        res.redirect('/');
    });
});

app.post('/task/delete/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id, err => {
        res.redirect('/');
    });
});

app.listen(conf.port, () => {
    console.log(`Server started on port ${conf.port}`);
});
