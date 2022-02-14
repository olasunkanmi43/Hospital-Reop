const express = require('express');
const router = express.Router();

const Patient = require('../models/patient');
const Diagnosis = require('../models/diagnosis');


router.get('/', (req, res) => {
    res.render("welcome");
})

router.get('/dashboard', (req, res) => {
    // res.send("I am here");
    // console.log(req.session);

    if(!req.session.user_id) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
        res.render('dashboard', {u_id:req.session.user_id, uname:req.session.username});
    }
})

router.get('/addpatient', (req, res) => {
    if(!req.session.user_id) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
        res.render('add_patient', {u_id:req.session.user_id, uname:req.session.username});
    }
})

router.post('/addpatient', (req, res) => {

    if(!req.session.user_id) {
        res.redirect('/login');
    } else {
       // console.log(req.body);
        //res.send("Data has been sent");
          const{firstname, lastname, gender, phone, maritalStatus, bloodGroup, genotype} = req.body;
        
          let errors = [];


          if(!firstname || !lastname || !gender || !phone || !maritalStatus || !bloodGroup || !genotype) {
              errors.push({msg: "Some fields are missing. Please fill them up"});
          }
              if(errors.length > 0) {
                 res.render('add_patient', {errors, u_id:req.session.user_id, uname:req.session.username, firstname, lastname, gender, phone, maritalStatus, bloodGroup, genotype})
             } else {

                const patient = new Patient({
                    firstname,
                    lastname,
                    gender,
                    phone,
                    maritalStatus,
                    bloodGroup,
                    genotype,
                    username: req.session.username
                })

                patient.save((err) => {
                    if(err) {
                        req.flash('error_msg', "There was a problem registering. Please try again");
                        res.redirect('/addpatient');
                    } else {
                        req.flash('success', "Patient Successfully Saved into DB");
                        res.redirect('/addpatient');
                    }
                })
            }
        }
    
   
})

router.get('/viewpatient', (req, res) => {
    if(!req.session.user_id) {
        req.flash = ("error_msg", "Please login");
        res.redirect("/login");
    } else {
        Patient.find({username:req.session.username}, (err, result) => {
            if(err) {
                req.flash('error_msg', "There was a problem loading Patient registering");
            } else {
                res.render('view_patient', {u_id:req.session.user_id,uname: req.session.username,result});
            }
        })
    }
})

router.get('/addDiagnosis/:patientID', (req, res) => {
    if(!req.session.user_id) {
        res.redirect('/login');
    } else {
        res.render('add_diagnosis', {u_id:req.session.user_id, uname: req.session.username, p_id: req.params.patientID});
    }
})

router.post('/addDiagnosis', (req, res) => {
    if(!req.session.user_id) {
        res.redirect('/addpatient');
    } else {
        const{patient_id, complaint, recommendation} = req.body;
        let errors = [];

        if(!patient_id || !complaint || !recommendation) {
            errors.push({msg: "Some fields are missing. Try again"});
        }
        if(errors.length > 0) {
            res.render('add_diagnosis', {errors, user_id:req.session.user_id, uname:req.session.username, patient_id, complaint, recommendation})
        } else {
            const diagnosis = new Diagnosis({
                patient_id,
                complaint,
                recommendation,
                username: req.session.username
            })

            diagnosis.save((err) => {
                if(err) {
                    req.flash('error_msg', "There was a problem. Please try again");
                    res.redirect('/addDiagnosis');
                } else {
                    req.flash('successfully', "Diagnosis Successfully Saved into DB");
                    res.redirect('/addDiagnosis');
                }
            })
        }
    }
})

router.get('/viewdiagnosis', (req, res) => {
    if(!req.session.user_id) {
        req.flash = ('error_msg', "Please try again");
        res.redirect('/login');
    } else {
        Diagnosis.find({username:req.session.username}, (err, diago) => {
            if(err) {
                req.flash('error_msg', "There was problem");
            } else {
                res.render('/view_diagnosis', {u_id:req.session.user_id, uname:req.session.username, diago});
            }
        })
    }
})




module.exports = router;