const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user.controller');
const ctrlAdmin = require('../controllers/admin.controller');
const jwtHelper = require('../config/jwtHelper');

//image upload
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'image/doc') {
        filetype = 'doc';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage, limits : {fileSize : 1000000}});




router.post('/register',ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/userprofile',jwtHelper.verifyJwtToken,ctrlUser.userprofile);
router.get('/getprofile', jwtHelper.verifyJwtToken,ctrlUser.getprofile);
router.post('/req-reset-password', ctrlUser.forgot);
// Admin
router.get('/home', ctrlAdmin.adminHome);
// router.get('/delete',);
module.exports = router;



