const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    userid:{
        type: String, 
    },
    token: { type: String},
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
    firstname: {
        type: String,
       
    },
    lastname: 
    {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    emailToken:
    {
        String
    },
    empid:{
        type: String,
    },
    password: {
        type: String,
        // required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
   
    personalemail: {
        type: String,
      
    },
    birthday:{
        type: Date, 
    },

    currentaddress: {
        type: String,
      
    },
    isVerified: { type: Boolean, default: false },
    city:
    {
        type: String,
       
    },
    country:
    {
        type: String,
    },
    postalcode:
    {
        type: String,
    },
    permanentaddress: {
        type: String,
     
    },
    mobileno: {
        type: String,
       
    },
    alternativeno: {
        type: String,
      
    },
    usertype:
    {
         type: String,

    },
   tlassociated:
    {
         type: String,

    },
    nomineename:
    {
        type: String,
     
    },
    nomineeno:
    {
        type: String,
        
    },
    gender:
    {
        type: String,
        
    },
    updateddate: {
        type: Date,
       
    },
    uploadedimage: {
        type: String,
    },
    // documentupload: {
    //     type: String,
    // },
    bio:
    {
        type: String,
    },
    created: { 
        type: Date, 
        default: Date.now 
    },
    saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
userSchema.path('personalemail').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
userSchema.path('mobileno').validate((val) => {
    emailRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return emailRegex.test(val);
},'please Enter a valid mobile number(10 digits)');
userSchema.path('alternativeno').validate((val) => {
    emailRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return emailRegex.test(val);
},'please Enter a valid mobile number(10 digits)');
userSchema.path('nomineeno').validate((val) => {
    emailRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return emailRegex.test(val);
},'please Enter a valid mobile number(10 digits)');
userSchema.pre('findOneAndUpdate', function (next) 
{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => 
        {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
})
// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => 
        {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}
mongoose.model('User', userSchema);