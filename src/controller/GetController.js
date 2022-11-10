const mongoose = require('mongoose');
const userModel = require("../model/userModel")






const getUserById = async function (req, res) {
    try {
     
        

      
        let user = await userModel.find()
       
 
        return res.status(200).send({ status: true, msg: "User data", data: user });
            

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}




module.exports.getUserById = getUserById



