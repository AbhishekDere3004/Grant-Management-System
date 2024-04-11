const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
       
    },
    cpassword:{
        type:String,
      
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    verifytoken:{

        type: String,
    }
});

userSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }


    next()
});
//token generate
userSchema.methods.generateAuthtoken = async function () {
    try {
        let token23 = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,  // this is payload
            {
                expiresIn: "2h"
            });

        this.tokens = this.tokens.concat({ token: token23 }); // this.token means which is in userschema and token23 is 
        await this.save();
        return token23;
    } catch (error) {
        res.status(422).json(error)
    }
}


const Userdb = mongoose.model("User", userSchema);
module.exports = Userdb;