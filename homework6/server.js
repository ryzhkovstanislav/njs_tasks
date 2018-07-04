const path = require('path');
const crypto = require('crypto');

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('cookie-session');

const conf = require('./configs/main_conf.json');
const Task = require('./models/task');
const User = require('./models/user');

mongoose.connect(`mongodb://${conf.host}/${conf.db}`);
const app = express();

/* Строку app.use(session({'keys': ['secret']})) поставил перед app.use(passport.session())
и только тогда req.user стал сохраняться при переходе со страницы на страницу.
До этого при переходе на новую страницу req.user возвращал undefined
*/  
app.use(session({'keys': ['secret']}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));

passport.use(new LocalStrategy(async (username, password, done) => {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
    const user = await User.findOne({email: username, password: hash});
    if (user === null) {
        return done(null, false);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    const user = await User.findOne({email: email});
    done(null, user);
});

/*
Можно ли вместо редиректа в случае фэйла вызвать render страницы с передачей туда ошибки?
*/
const authHandler = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign_in/error/',
});

app.get('/', async (req, res) => {
    const tasks = await Task.find();
    const context = {
        tasks: tasks,
        user: req.user,
    }
    res.render('index', context);
});


/* 
Регистрация
*/
app.get('/sign_up/', (req, res) => {
    res.render('sign_up');
});

app.post('/sign_up/', async (req, res) => {
    const errors = [];
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    let user = await User.findOne({email: username});
    if (user !== null) {
        errors.push('Пользователь с таким именем существует!');
    }
    if (password !== password2) {
        errors.push('Повторный email введен неверно!');
    }
    if (errors.length > 0) {
        return res.render('sign_up', {error: errors[0]});
    } 
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
    user = new User({
        email: username,
        password: hash,
    });
    user.save();
    res.redirect('/');
})

/*
Авторизация
 */
app.get('/sign_in/', (req, res) => {
    res.render('sign_in');
});

app.post('/sign_in/', authHandler);

app.get('/sign_in/error/', (req, res) => {
    res.render('sign_in_error', {error: 'Неправильное имя пользователя или пароль!'});
});

/*
Выход
*/
app.get('/logout/', (req, res) => {
    req.logout();
    res.redirect('/');
});

/*
Создание заданий 
*/
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
