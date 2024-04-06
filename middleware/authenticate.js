const jwt = require("jsonwebtoken");
const Userdb = require("../model/user");
// const keysecret = "pratikkateqwertyuihgfdsazxcvbnmj"


const authenticate = async(req,res,next)=>{

    try {
        const token = req.headers.authorization;
        
        const verifytoken = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(verifytoken);
        const rootUser = await userdb.findOne({_id:verifytoken._id});
        // console.log(rootUser);

        if(!rootUser) {throw new Error("user not found")}

        console.log(rootUser)

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    } catch (error) {
        res.status(401).json({status:401,message:"Unauthorized no token provide"})
    }

}


module.exports = authenticate;