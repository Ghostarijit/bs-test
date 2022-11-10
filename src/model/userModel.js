const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        
    },
    email: {
        
        type: String
        
    },
    password: {
      
        type: String
    },
    profileImage: {
        type: String
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  

}, { timestamps: true });


module.exports = mongoose.model('users', userSchema)