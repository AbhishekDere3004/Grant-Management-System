const bcrypt = require("bcrypt");
require("dotenv").config();
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/authenticate");


const User = require("../model/user");
const Userdb = require("../model/user");




const signup = async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill in all the details" });
    }

    try {
        const preuser = await user.findOne({ email: email });

        if (preuser) {
            return res.status(422).json({ error: "This email already exists" });
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "Password and Confirm Password do not match" });
        } else {
            const finalUser = new user({
                name, email, password, cpassword
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            });

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Welcome to our Platform!',
                text: `Hi ${name},\n\nThank you for signing up. We are excited to have you on board!\n\nBest regards,\nGMS Team`
            };

            transporter.sendMail(mailOptions, (error, _info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({ error: "Error sending email" });
                } else {
                    console.log("Email sent successfully");
                    return res.status(200).json({ message: "Email sent successfully" });
                }
            });

            const storeData = await finalUser.save();
            return res.status(201).json({ status: 201, storeData });
        }

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Fill in all the details" });
    }

    try {
        const userValid = await User.findOne({ email: email });

        // if (!userValid) {
            if (userValid) {
            // return res.status(422).json({ error: "User not found" });
        // }

        const isMatch = await bcrypt.compare(password, userValid.password);

        if (!isMatch) {
            return res.status(422).json({ error: "Invalid details" });
        }else{

        // Generate token and set cookie
        // const token = jwt.sign({ _id: userValid._id }, process.env.JWT_SECRET);
        // res.cookie("usercookie", token, {
        //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        // });

        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
            expires: new Date(Date.now() + 9000000),
            httpOnly: true
        });

        const result = {
            userValid,
            token
        }
        res.status(200).json({ message: "Login successful", token,result });
    }
            // console.log(token);
    }else{
        res.status(401).json({status:401,message:"invalid detailssss"});
    }

        } catch (error) {
            // console.error("Login error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


    // router.get("/logout", authenticate, async (req, res) => {
    //     try {
    //         req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {  // we use filter becuase it will chek the specific uses..curelem means current element
    //             return curelem.token !== req.token
    //         });

    //         res.clearCookie("usercookie", { path: "/" });

    //         req.rootUser.save();

    //         res.status(201).json({ status: 201 })

    //     } catch (error) {
    //         res.status(401).json({ status: 401, error }) 
    //     }
    // });

    // send email Link for reset Password

    const sendpasswordlink = async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide your email address" });
        }

        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Generate a token for password reset
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            // Update user's verifytoken field with the generated token
            user.verifytoken = token;
            await user.save();

            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });

            // Compose email options
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Password Reset Link',
                text: `Please click on the following link to reset your password this link valid for 2 minutes: ${process.env.CLIENT_URL}/${user.id}/reset-password/${token}` // Update with your client URL
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({ message: "Failed to send email" });
                } else {
                    console.log("Email sent successfully");
                    return res.status(200).json({ message: "Email sent successfully" });
                }
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };


    // verify user for forgot password time
    const forgot = async (req, res) => {
        const { id, token } = req.params;
        // console.log(token);
        // console.log(id);

        try {
            const validuser = await Userdb.findOne({ _id: id, verifytoken: token });

            if (!validuser) {
                return res.status(401).json({ status: 401, message: "User does not exist" });
            }

            const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!verifyToken) {
                return res.status(401).json({ status: 401, message: "Invalid token" });
            }

            res.status(201).json({ status: 201, validuser });
        } catch (error) {
            console.error("Error in forgot endpoint:", error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
    };

    // change password

    // const changepass = async (req, res) => {
    //     const { id, token } = req.params;
    //     const { password } = req.body;
    //     // console.log(password,id,token)
    //     try {
    //         const validuser = await userdb.findOne({ _id: id, verifytoken: token });
    //         console.log(validuser)
    //         const verifyToken = jwt.verify(token, JWT_SECRET);


    //         if (!validuser && verifyToken._id) {
    //             const newpassword = await bcrypt.hash(password, 12);
    //             const setnewuserpass = await userdb.findByIdAndUpdate({ _id:id }, { password:newpassword });

    //             setnewuserpass.save();
    //             res.status(201).json({ status: 201, message: "Password updated successfully" });
    //         } else {
    //             res.status(401).json({ status: 401, message: "user not exist" });
    //         }
    //     } catch (error) {
    //         res.status(401).json({ status: 401, message: error });
    //     }
    // };

    const changepass = async(req,res)=>{
        const {id,token} = req.params;
    
        const {password} = req.body;
    
        try {
            const validuser1 = await Userdb.findOne({_id:id,verifytoken:token});
            console.log(validuser1)
            const verifyToken = jwt.verify(token,process.env.JWT_SECRET);
    
            if(validuser1 && verifyToken._id){
                const newpassword = await bcrypt.hash(password,12);
    
                const setnewuserpass = await Userdb.findByIdAndUpdate({_id:id},{password:newpassword});
    
                setnewuserpass.save();
                res.status(201).json({status:201,setnewuserpass})
    
            }else{
                res.status(401).json({status:401,message:"user not exist"})
            }
        } catch (error) {
            res.status(401).json({status:401,error})
        }
    }

    module.exports = { signup, login, sendpasswordlink, forgot, changepass };




