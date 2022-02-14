const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Doctor = require('../models/doctor');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/signup', (req, res) => {

    // console.log(req.body);

    const{firstname, lastname, gender, phoneNumber, qualification, specialization, hospitalName, username, pass1, pass2} = req.body;

    let errors = []; //WE CREATE AN EMPTY ERROR ARRAY

    if(!firstname || !lastname || !gender || !phoneNumber || !qualification || !specialization || !hospitalName || !username || !pass1 || !pass2){
        errors.push({msg: "Some fields are missing. No field should be empty"});


    }

    if(pass1 !== pass2) {
        errors.push({msg: "Passwords don not match. Please try again"});
    }

    if(pass1.length < 6) {
        errors.push({msg: "Password should be atleast 6 characters"});
    }

    if(errors.length > 0) {
        res.render('signup',{errors, firstname, lastname, gender, phoneNumber, qualification, specialization, hospitalName, username, pass1, pass2});
    } else {
            // WE WANT TO ENSURE NO 2 USERS  HAVE THE SAME USERNAME
            Doctor.findOne({username:username}, (err, doctor) => {
                if(err) {

                    req.flash('error_msg', 'There\'s an issue. Please try again');
                    res.redirect('/signup');
                    console.log(err);
                    // res.send("There's an issue. Please try again");
                }

                if(doctor){

                    req.flash('error_msg', 'This Username already exists. Please find another');
                    res.redirect('/signup');
                    // res.send("This Username is not available");
                    // console.log(doctor);
                } else {
                    // res.send("Username is available");

                    bcrypt.hash(pass1, 10, (error, hash) =>{
                        const doc = new Doctor({
                            firstname,
                            lastname,
                            gender,
                            phoneNumber,
                            qualification,
                            specialization,
                            hospitalName,
                            username,
                            password: hash
                        })
                        doc.save((err)=>{
                            if(err) {
                                // res.send("There was a problem registering")
                                req.flash('error_msg', "There was a problem registering");
                                res.redirect('/signup');

                            } else {
                                req.flash('message', "You are now registered and can login");
                                res.redirect('/login');
                            }
                        })
                    })
                }
            })
    }
})

router.post('/login', (req, res) => {
    // console.log(req.body);
    const{username, password} = req.body;

    Doctor.findOne({username:username}, (err, result) => {
        if(err) {
            req.flash('error_msg', "Something unusual has happened. Please try again");
            res.redirect('/login');
        }
        if(result == null) {
            req.flash('error_msg', "Username and/or Password does not exist");
            res.redirect('/login');
            //console.log(result);
        } else {
            bcrypt.compare(password, result.password, (err, isVerified) => {
                    if(err) {
                        req.flash('error_msg', "Something uncommon has happened. Please try again");
                        res.redirect('/login');
                    }

                    if(isVerified) {
                        req.session.user_id = result._id;
                        req.session.username = result.username;
                        req.flash('message', "Welcome you have logged in");
                        res.redirect('/dashboard');
                    } else {
                        //res.send("Password is incorrect");
                        req.flash('error_msg', 'Password is not correct');
                        res.redirect('/login');
                    }
            })
            // res.send("There's no User");
        }
    })
})

module.exports = router;

