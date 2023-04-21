const User = require('../model/User.Model')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const Apperror = require('../utils/AppError');

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    // user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
const signUp = async(req,res,next)=>{
    const mail = req.body.email
    try{
        const existMail = await User.findOne({email:mail})
        // console.log(existMail)
        
        if(existMail) return next(new Apperror("email already exists"))
        const newUser = await User.create(req.body)
       await sendEmail({email: newUser.email,
                password: req.body.password,
                username:  newUser.name
                        });
        
        createSendToken(newUser, 201, res)

    }catch(err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}


const login = async(req,res,next)=>{
    const {email , password} = req.body;
//check if email and password exist
    if(!email || !password){
        return next(new Error('Please provide email and password!', 400));
    }
    //check if user exirs & password is correct
    try{

        const user = await User.findOne({email}).select('+password')
        console.log(user)

        if(!user) return next(new Apperror("please sign up"))
       if (!user || !(await user.correctPassword(password, user.password))) {
         return next(new Apperror('Incorrect email or password', 401));
 }

 createSendToken(user, 200, res);
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err
        })
    }

}


module.exports = {
    signUp,
    login
}