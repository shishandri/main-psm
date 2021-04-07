const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {v4 : uuidv4} = require('uuid')
const User = mongoose.model('User');
const passport= require('passport');
const _ = require('lodash');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');
module.exports.register = (req, res, next) => 
{
                 var user = new User();
                 newRoomId = user._id;
                 const userid = uuidv4();
                 user.userid = userid;
                 user.firstname = req.body.firstname;
                 user.lastname = req.body.lastname;
                 user.email = req.body.email;
                 user.password = req.body.password;
               
        user.save((err, doc) => 
        {
            if (!err)
            {
                res.send(doc);
               
            }
            else {
                if (err.code == 11000)
                    res.status(422).send(['Duplicate email adrress found.']);
                else
                    return next(err);
                   
            }
        });
    }
    module.exports.authenticate = (req, res, next) => 
    {
          
            // call for passport authentication
            passport.authenticate('local', (err, user, info) => {       
                // error from passport middleware
                if (err) return res.status(400).json(err);
                // registered user
                else if (user) return res.status(200).json({ "token": user.generateJwt() });
                // unknown user or wrong password
                else return res.status(404).json(info);
            })(req, res);
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
                   
                    User.findOne({ email:user.email }, function(err, user) {
                        if(!user) {
                            req.flash('error', 'No acccount with that email address exists.');
                            return res.redirect('/forgot');
                        }
              
                        // user.save(function(err,doc) 
                        // {
                        //     if (!err)
                            
                        //     res.send(doc);
                        //     done(err, token, user);
                        //     // console.log(user);
                        // });
                    });
                },
                function(token, user, done) {
                    var transporter  = nodemailer.createTransport(  {
                        service: 'gmail',
                           port: 465,
                          secure: true,
                            auth: {
                                user: "testusr5055@gmail.com",  
                                pass: 'james_bon007'
                                   }
            });
                    var mailOptions = {
                        to: 'shishandrikaul9@gmail.com',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://162.241.70.148:4200/new-password/' +token+ '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        }
                        transporter .sendMail(mailOptions, function(err) 
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
           
           
        });
            // User.findOne({ _id: req._id }, 
            //     (err, user) => {
            //         if (!user)
            //             return res.status(404).json({status: false, message: 'User record not found.' });
            //         else
            //             return res.status(200).json({ status: true, user : _.pick(user,['_id','firstname','lastname','email','password']) });
            //     }
            // );
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