const mongoose = require('mongoose');

const personnelSchema = ({
    firstname:{
        type: String,
        required:true
    },

    lastname:{
        type: String,
        required:true
    },

    gender:{
        type: String,
        required:true
    },

    phoneNumber:{
        type: String,
        required:true
    },

    qualification:{
        type: String,
        required:true
    },

    specialization:{
        type: String,
        required:true
    },

    hospitalName:{
        type: String,
        required:true
    },

    username:{
        type: String,
        required:true
    },

    password:{
        type: String,
        required:true
    },

    date_registered:{
        type: Date,
        default: Date.now
    }
})

const Personnel = new mongoose.model('Personnel', personnelSchema);

module.exports = Personnel;