const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError')
const User = require('./../model/User.Model');

const validated = async (req,res,next)=>{
  // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401)
        );
      }
 // 2) Verification token
      const decoded = await jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if(err) return next(new AppError("Please login again.", 401))
        else {

          const currentUser = await User.findById(decoded.id);
          if (!currentUser) {
            return next(
              new AppError(
                'The user belonging to this token does no longer exist.',
                401
              )
            );
          }
      // access
      req.user = currentUser;
      next();
        }
      });


}


module.exports = validated