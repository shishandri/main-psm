const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
	service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
	auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PW_EMAIL, // generated ethereal password
	}
});

let mailDetails = {
	from: 'testusr5055@gmail.com',
	to: 'shishandrikaul9@gmail.com',
	subject: 'Test mail',
	text: 'Node.js testing mail for GeeksforGeeks'
};

mailTransporter.sendMail(mailDetails, function(err, data) {
	if(err) {
		console.log('Error Occurs');
	} else {
		console.log('Email sent successfully');
	}
});
