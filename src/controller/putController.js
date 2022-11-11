const mongoose = require('mongoose');
const userModel = require("../model/userModel")

const bcrypt = require("bcrypt")
const aws = require("aws-sdk")
const multer = require("multer");
const { json } = require('express/lib/response');

// connect AWS
aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "Arijit/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log(data)
             console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"

    })
}






const updateuser = async function (req, res) {

    try {
     

        




        let data = req.body

       // let files = req.files

// console.log(req.userId)
       

//         let {  name ,email, password } = data // destructuring

   
      


//         // user present or not
//         let status = await userModel.findById(req["userId"])
//         if (!status) return res.status(404).send({ msg: "this user is not present" })



//         if (status.isDeleted === true) return res.status(404).send({ status: false, msg: "this user is already deleted" })

       
        
//         if (name) {

//             if (typeof name !== "string" || name.trim().length === 0) return res.status(400).send({ status: false, msg: "name should be string" });

//             let nname = /^[a-zA-Z ]{2,30}$/.test(name.trim())
//             if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })

//             data.name = data.name.trim()

//         }
    

       

//         if (email) {
//             if (typeof email != "string")
//                 return res.status(400).send({ status: false, message: "Email must be in String datatype" })
//             let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

//             let x = regx.test(email.trim())
//             if (!x) {
//                 return res.status(400).send({ status: false, msg: "write the correct format for email" })
//             }
//             let mail = await userModel.findOne({ email: email.trim().toLowerCase() })

//             if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
//             data.email = data.email.trim().toLowerCase()
//         }

//         if (password) {

//             if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

//            // let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*\.])(?=.*[A-Z]).{8,200}$/.test(password.trim())

//             //if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })

//             const salt = await bcrypt.genSalt(10)

//             let passs = await bcrypt.hash(data.password, salt)

//             data.password = passs
//         }
        //let files = req.files
        /*if (files) {





            // let files = req.files
            // console.log(files)
            if (files && files.length > 0) {
                //upload to s3 and get the uploaded link
                // res.send the link back to frontend/postman
                let uploadedFileURL = await uploadFile(files[0])
                data.profileImage = uploadedFileURL
                let Image = data.profileImage
                // return res.status(201).send({ status: true, data: user })

                const update = await userModel.findOneAndUpdate({ _id: userId?.trim() }, {

                    $set: { profileImage: Image }

                }, { new: true })
            }

        }
*/
        //console.log(files)
        const existingUser = await userModel.findById(req.userId)
        if(!existingUser){
        return res.status(404).send({ msg: "this user is not present" })
            
        }
        if(req.body.email){
            existingUser.email = req.body.email
        }
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            let passs = await bcrypt.hash(req.body.password, salt)
            existingUser.password = passs
        }
        if(req.body.name){
            existingUser.name = req.body.name
        }

        const updatedUser = await existingUser.save()

        return res.status(200).send({ status: true, msg: "updated User", data: updatedUser });
    } catch (err) {
        // console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}



const updateProfilePic = async function (req, res) {

    try {
     

        




    

        let files = req.files

        console.log('Files' ,files)
        console.log(req.body)

        if (files) {





            // let files = req.files
            // console.log(files)
            if (files && files.length > 0) {
                //upload to s3 and get the uploaded link
                // res.send the link back to frontend/postman
                let uploadedFileURL = await uploadFile(files[0])
                
                console.log(uploadedFileURL)
                // return res.status(201).send({ status: true, data: user })

                const update = await userModel.findOneAndUpdate({ _id: req.userId?.trim() }, {

                    $set: { profileImage: uploadedFileURL }

                }, { new: true })
                return res.status(200).send({ status: true, msg: "ProfilePhoto Upload Successfully", data: update });
            }

        }

        
       

        
    } catch (err) {
        // console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}








module.exports.updateuser = updateuser

module.exports.updateProfilePic= updateProfilePic

