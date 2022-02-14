const mongoose = require('mongoose');

const patientSchema = ({
    firstname:{
        type: String,
        required: true
    },

    lastname:{
        type: String,
        required: true
    },

    gender:{
        type:String,
        required: true
    },

    phone:{
        type:String,
        required: true
    },

    maritalStatus:{
        type:String,
        required: true
    },

    bloodGroup:{
        type:String,
        required: true
    },

    genotype:{
        type:String,
        required: true
    },

    // nationality:{
    //     type:String,
    //     required: true
    // },

    username:{
        type:String,
        required: true
    },

    date_registered:{
        type:Date,
        default: Date.now
    }
})

const Patient = new mongoose.model('Patient', patientSchema);

module.exports = Patient;