const express = require('express'),
    mongoose = require('mongoose'), 
    session = require('express-session'),
    flash = require('connect-flash'),
    app = express();

    // DB CONFIG
    const db = require('./config/keys').mongoURI;
    mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology:true});



    app.set('view engine', 'ejs');
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));

   
    //EXPRESS-SESSION MIDDLEWARE
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));


    // CONNECT FLASH
    app.use(flash());

    //GLOBAL VARS
    app.use((req, res, next) => {
        res.locals.message = req.flash('message');
        res.locals.error_msg = req.flash('error_msg');
        // res.locals.error = req.flash('error);
        next();
    });


    app.use('/', require('./routes/index'));
    app.use('/', require('./routes/users'));



app.listen(4100, function() {
    console.log('Server started on port 4100');
});