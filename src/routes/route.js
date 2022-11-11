const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
const middleWare = require("../middleWare/auth")
const put = require("../controller/putController")
const dController = require("../controller/DeleteControlle")
const user = require("../controller/userController")
const get = require("../controller/GetController")





// User APIs
router.post("/register", user.createuser)// 1

router.post("/user/login", loginController.loginUser)// 2

router.put("/user/update/profile", middleWare.validateToken, put.updateuser)// 3

router.put("/user/upload", middleWare.validateToken, put.updateProfilePic)// 4

router.get("/user/profile", get.getUserById)// 5

router.delete("/user/deleteprofile",  middleWare.validateToken, dController.deletUser) //6














module.exports = router;