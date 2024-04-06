const mongoose = require("mongoose");

const googleSchema = new mongoose.Schema({

    googleId:String,
    displayName:String,
    email:String,
    image:String
},{timestamp:true})


const userdb = new mongoose.model("google",googleSchema)
module.exports = userdb;