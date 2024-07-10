const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password=hashedPassword

        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch(error){
        res.send(error);

    }


});

router.post("/login", async (req, res) => {
    const user = await User.findOne({email : req.body.email})

    if(!user){
        res.send({
            success : false,
            message : 'User Does not exist , please register'
        })
    }


    const validPassword = await bcrypt.compare(req.body.password ,user.password )

    if(!validPassword){
        return res.send({
            success : false,
            message :"Invalid Password"
        })
    }

    res.send({
        success : true,
        message :"user Logged in"
    })


});



module.exports = router;