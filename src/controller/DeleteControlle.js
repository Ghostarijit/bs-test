const mongoose = require('mongoose');

//const productModel = require("../model/productModel")
const userModel = require("../model/userModel")
const bcrypt = require("bcrypt")



const deletUser = async(req, res) => {
    try {

        // let data = req.body
        // //console.log(data)
        // let {email , password} = data

        
      
        let userid = req.userId;

       
        console.log(userid)
        let status = await userModel.findById(userid)
        
        if (!status) return res.status(404).send({ status: false, msg: "this user is not present" })

        if (status.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "this user is already deleted" })
        }

        
            // console.log(a)
             // Creating token Under Using userId with secret Key
           
                 
                let user = await userModel.findByIdAndUpdate(userid, { $set: { isDeleted: true } }, { new: true })
                return res.status(200).send({ status: true, msg: "user is deleted successfully",data:user })
                
             
         
        // authorization
        

        
       

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}
module.exports.deletUser = deletUser

