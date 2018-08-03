const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const config = require('../config/database');

//Register
router.post('/register', (req,res,next) => {

    console.log('received POST request for regiser');
    console.log(req.body);

    if(req.body){
        let newUser = new User({
            name:req.body.name,
            email : req.body.email,
            username : req.body.username,
            password : req.body.password
        });
    
        User.addUser(newUser, (err,user) => {
            console.log('addUser callback called');
            if(err){
                res.json({success: false,msg:'Failed to register user'});            
            }
            else{
                res.json({success:true,msg:'User registered'});
            }
        });
    }   
   
});

//Authenticate
router.post('/authenticate', (req,res,next) => {

    console.log(req.body);

    const userName = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(userName, (err,user)=>{
        if(err){            
            throw err;
        }

        if(!user){
            return res.json({success:false, msg: "User not found"});
        }

        console.log(user);        

        User.comparePassword(password, user.password,(err,isMatch)=>{
            if(err){
                throw err;
            }

            if(isMatch){
                console.log('match !! sigining...');
                
                let payload = {};
                payload.id = user._id;
                payload.name = user.name;
                payload.username = user.username;
                payload.email = user.email;
                payload.password = user.password;

                const token = jwt.sign(payload,config.secret, {
                    expiresIn : 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user : {
                        id : user._id,
                        name : user.name,
                        username : user.username,
                        email : user.email
                    }
                });
            }
            else{
                res.json({
                    success : false,
                    msg : 'Wrong password'
                });
            }
        });

    });
});

//Profile
// passport.authenticate protects the profile route
router.get('/profile', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    res.json({user : req.user});
});

module.exports = router;