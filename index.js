var mail = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "testusr5055@gmail.com",  
		pass: 'james_bon007',
	}
  });

var mailOptions = {
	from: 'testusr5055@gmail.com',
	to: 'shishandrikaul9@gmail.com',
	subject: 'Sending Email via Node.js',
	text: 'That was easy!'
  };
  
  mail.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	}
  });