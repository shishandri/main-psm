const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {v4 : uuidv4} = require('uuid')
const User = mongoose.model('User');
const passport= require('passport');
const _ = require('lodash');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');
const express = require('express');
const router = express.Router();


module.exports.register = (req, res, next) => 
{
      
    
   
    var user = new User();
    const userid = uuidv4();
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    user.userid = userid;
    password = req.body.password,
    token = crypto.randomBytes(64).toString('hex'),
    console.log(token);
    User.findOne({ email: req.body.email }, function (err, user) 
    {
        if(err)
        {
            return res.status(500).send({msg: err.message});
        }
      
        else if (user) {
            return res.status(400).send({msg:'This email address is already associated with another account.'});
        }
        else{
           
            user = new User({firstname:req.body.firstname,lastname:req.body.lastname,
            email: req.body.email,password: req.body.password,token:token});
            user.save(function (err) {
                if (err) { 
                  return res.status(500).send({msg:err.message});
                }
            //    var user = new User({  Token:token });
                user.save(function (err,doc) {
                  if(err)
                  {
                    return res.status(500).send({msg:err.message});
                  }
             
    
                    var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: "testusr5055@gmail.com", pass:'james_bon007'} });
                    var mailOptions = { from: 'shishandrikaul9@gmail.com', to: user.email, subject: 'Account Verification Link', 
                    text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host +'\/api\/'+ '\confirmation\/' + user.email + '\/' + token + '\n\nThank You!\n' };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) { 
                            return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                         }
                        return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                    });
                });
            });
        }
        
      });
    
    }


    exports.confirmEmail = function (req, res, next) 
    {
      
        User.findOne({ token: req.params.token }, function (err, token) {
            // token is not found into database i.e. token may have expired 
            if (!token){
                return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
            }
            // if token is found then check valid user 
            else{
                User.findOne({ _id: token._id, email: req.params.email}, function (err, user) {
                    // not valid user
                    if (!user){
                        return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
                    } 
                    // user is already verified
                    else if (user.isVerified){
                        return res.status(200).send('User has been already verified. Please Login');
                    }
                    // verify user
                    else{
                        // change isVerified to true
                        user.isVerified = true;
                        user.save(function (err) {
                            // error occur
                            if(err){
                                return res.status(500).send({msg: err.message});
                            }
                            // account successfully verified
                            else{
                              return res.status(200).send('Your account has been successfully verified');
                            }
                        });
                    }
                });
            }
            
        });
    }



       

    module.exports.authenticate = (req, res, next) => 
    {

        User.findOne({ email: req.body.email}, function(err, user,doc) {
            // error occur
           console.log(user);
            if(err)
            {
                return res.status(500).send({msg: err.message});
            }
            // user is not found in database i.e. user is not registered yet.
            else if (!user){
                return res.status(401).send({ msg:'The email address ' + req.body.email + ' is not associated with any account. please check and try again!'});
            }
          
            else if (!user.isVerified)
            {
                return res.status(401).send({msg:'Your Email has not been verified. Please click on resend'});
            } 
            // user successfully logged in
            else{
                // return res.status(200).send('User successfully logged in.');
                return res.status(200).json({ "token": user.generateJwt() });
            }
        });
    
           // call for passport authentication
            // passport.authenticate('local', (err, user, info) => 
            // {        console.log(user);
                
            //     // error from passport middleware
            //     if (err) return res.status(400).json(err);
            //     // registered user
            //     else if (user) return res.status(200).json({ "token": user.generateJwt() });
           
            //     // unknown user or wrong password
            //     else return res.status(404).json(info);
            // })(req, res);
    
    }
        module.exports.forgot=(req, res, next)=> 
        { 
            var user = new User();
            user.email=req.body.email;
            console.log(user.email)
            async.waterfall([
                function(done) 
                {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) 
                {   
                   
                    User.findOne({email:user.email}, function(err, user) {
                        if(!user) 
                        {
                            req.flash('error', 'No acccount with that email address exists.');
                            return res.redirect('/forgot');
                        }
                        user.save(function(err,doc) 
                        {
                            if (!err)
                            
                            res.send(doc);
                            done(err, token, user);
                            //console.log(user);
                        });
                    });
                },
                function(token, user, done) 
                {
                   var nodemailer = require("nodemailer");
                   var smtpTransport = nodemailer.createTransport({
                   service: "gmail",
                    auth: {
                          user: "testusr5055@gmail.com",  
                          pass: 'james_bon007',
                           }
                        });
                    var mailOptions = 
                    {
                        from: 'shishandrikaul9@gmail.com',
                        to: user.email,
                        text: 'hi'
                       }
                       console.log(mailOptions)
                       smtpTransport.sendMail(mailOptions,function(err) 
                    {
                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with instructions as to how to change your password')
                        done(err, 'done');
                    });
                }
                ], function(err,doc) {
                    if(err) return next(err);
                    
                    res.redirect('/forgot');
                });
               
         };
        module.exports.userprofile = (req, res, next) =>
        {
           if(req.file)
           {

           
                var user = new User();
                User.findOneAndUpdate({_id: req._id},{$set:{
                empid : req.body.empid,
                personalemail : req.body.personalemail,
                birthday : req.body.birthday,
                currentaddress : req.body.currentaddress,
                permanentaddress : req.body.permanentaddress,
                city : req.body.city,
                country : req.body.country,
                postalcode : req.body.postalcode,
                mobileno : req.body.mobileno,
                alternativeno : req.body.alternativeno,
                usertype : req.body.usertype,
                tlassociated : req.body.tlassociated,
                nomineename : req.body.nomineename,
                nomineeno : req.body.nomineeno,
                gender : req.body.gender,
                updateddate : req.body.updateddate,
                bio : req.body.bio,
                uploadedimage:'http://localhost:3000/uploads/'+ req.file.filename,
        }}, {runValidators: true,setDefaultsOnInsert: true,upsert: true,  context: 'query'}, (err, doc) => {
            if (!err) 
            {
                res.send(doc);
            }
            else
                return next(err);
           
        });
    }
    if(!req.file)
    {
        
        var user = new User();
        User.findOneAndUpdate({_id: req._id},{$set:{
        empid : req.body.empid,
        personalemail : req.body.personalemail,
        birthday : req.body.birthday,
        currentaddress : req.body.currentaddress,
        permanentaddress : req.body.permanentaddress,
        city : req.body.city,
        country : req.body.country,
        postalcode : req.body.postalcode,
        mobileno : req.body.mobileno,
        alternativeno : req.body.alternativeno,
        usertype : req.body.usertype,
        tlassociated : req.body.tlassociated,
        nomineename : req.body.nomineename,
        nomineeno : req.body.nomineeno,
        gender : req.body.gender,
        updateddate : req.body.updateddate,
        bio : req.body.bio,
        
}}, {runValidators: true,setDefaultsOnInsert: true,upsert: true,  context: 'query'}, (err, doc) => {
    if (!err) 
    {
        res.send(doc);
    }
    else
        return next(err);
   
});
    }

   
           
        }
        module.exports.getprofile = (req, res, next) =>
        {
            User.findOne({ _id: req._id }, 
                (err, user) => {
                    if (!user)
                        return res.status(404).json({status: false, message: 'User record not found.' });
                    else
                        return res.status(200).json({ status: true, user : _.pick(user,['_id','firstname','lastname','email','password','personalemail']) });
                }
            );
        }










 //          var user = new User();
        //          newRoomId = user._id;
        //          const userid = uuidv4();
        //          user.userid = userid;
        //          user.firstname = req.body.firstname;
        //          user.lastname = req.body.lastname;
        //          user.email = req.body.email;
        //          user.password = req.body.password;
               
        // user.save((err, doc) => 
        // {
       
        //     if (!err)
        //     {
        //         res.send(doc);
               
        //     }
        //     else {
        //         if (err.code == 11000)
        //             res.status(422).send(['Duplicate email adrress found.']);
        //         else
        //             return next(err);
                   
        //     }
        // });
    


        
 //  user.findOneAndUpdate({userId: userId},{$set:
        //      firstname :req.body.firstname,
        //         lastname :req.body.lastname,
        //         username:req.body.username,
        //         email:  req.body.email,
        //         password:  req.body.password,
                //empid = req.body.empid,
                // personalemail : req.body.personalemail,
                // birthday : req.body.birthday,
                // currentaddress : req.body.currentaddress,
                // permanentaddress : req.body.permanentaddress,
                // city : req.body.city,
                // country : req.body.country,
                // postalcode : req.body.postalcode,
                // mobileno : req.body.mobileno,
                // alternativeno : req.body.alternativeno,
                // usertype : req.body.usertype,
                // tlassociated : req.body.tlassociated,
                // nomineename : req.body.nomineename,
                // nomineeno : req.body.nomineeno,
                // gender : req.body.gender,
                // updateddate : req.body.updateddate,
                // aboutme : req.body.aboutme,
          
        // }}
        // , {upsert: true}, (err, doc) => {
        //     if (!err) 
        //     {
        //         res.send(doc);
        //     }
        //     else {
        //         if (err.code == 11000)
        //             res.status(422).send(['Duplicate email adrress found.']);
        //         else
        //             return next(err);
        //     }
           
        // });

         // if (req.file)
    // {
    // user.uploadedimage = 'http://localhost:3000/uploads/'+ req.file.filename;
    // // user.documentupload = req.body.documentupload;
    // user.findOneAndUpdate({userId: userId},{$set:
    //     {  uploadedimage :req.file.filename}}
    //     , {upsert: true}, (err, doc) => {
    //         if (!err) 
    //         {
    //             res.send(doc);
    //         }
          
           
    //     });
    // }