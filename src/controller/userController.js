const { resetWatchers } = require("nodemon/lib/monitor/watch")
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
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"

    })
}


const createuser = async (req, res) => {
    try {
        let data = JSON.parse(JSON.stringify(req.body))
        //  data validation
        //console.log(data)
        let { name, profileImage, email, password } = data


        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })


        // fname validation
        // console.log(typeof name)
        if (!name || name === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        if (typeof name !== "string" || name.trim().length === 0) return res.status(400).send({ status: false, msg: "name should be string" });

        let nname = /^[a-zA-Z ]{2,30}$/.test(name.trim())
        if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })

        data.name = data.name.trim()



        // email validation
        if (!email) {
            return res.status(400).send({ status: false, msg: "email must be present" });
        }
        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "Email must be in String datatype" })
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

        let x = regx.test(email.trim())
        if (!x) {
            return res.status(400).send({ status: false, msg: "write the correct format for email" })
        }
        let mail = await userModel.findOne({ email: email.trim().toLowerCase() })

        if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
        data.email = data.email.trim().toLowerCase()

        // password validation
        if (!password) return res.status(400).send({ status: false, msg: "plz write the password" });
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

        // let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*\.])(?=.*[A-Z]).{8,200}$/.test(password.trim())

        // if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })
        const salt = await bcrypt.genSalt(10)

        data.password = await bcrypt.hash(data.password, salt)


        /*let files = req.files
        console.log(files)
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.profileImage = uploadedFileURL
            // user Creation
           // const user = await userModel.create(data)
            // return res.status(201).send({ status: true, data: user })
            res.status(201).send({ msg: "user profileImage uploaded succesfully and user Creation Successfull", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No ProfileImage found" })
        }*/

         console.log(data)
        const user = await userModel.create(data)
        console.log(user)
         return res.status(201).send({ status: true,msg:"User Registration successfull", data: user })
    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}



module.exports.createuser = createuser
