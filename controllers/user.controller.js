const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {v4 : uuidv4} = require('uuid')
const User = mongoose.model('User');
const passport= require('passport');
const _ = require('lodash');
module.exports.register = (req, res, next) => 
{
                 var user = new User();
                 newRoomId = user._id;
                 const userid = uuidv4();
                 user.userid = userid;
                 user.firstname = req.body.firstname;
                 user.lastname = req.body.lastname;
                 user.username = req.body.username;
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
         
        module.exports.userprofile = (req, res, next) =>
        {
            
                var user = new User();
                User.findOneAndUpdate({_id: req._id},{$set:{
                firstname :req.body.firstname,
                lastname :req.body.lastname,
                username:req.body.username,
                password:  req.body.password,
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
          
        }}, {upsert: true}, (err, doc) => {
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