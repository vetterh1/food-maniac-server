const logger = require('./logger.js');
const nodeMailer = require('nodemailer');

exports.testSendMail = function(req,res){
  const transporter = nodeMailer.createTransport({
    host: 'pro1.mail.ovh.net',
    port: 587,
    secure: false,  //true for 465 port, false for other ports
    auth: {
      user: 'laurent@food-maniac.com',
      pass: 'Plerin:22190'
    }
  });

  const mailOptions = {
    from: 'laurent@food-maniac.com', // sender address
    to: 'vetterh1@yahoo.fr', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world plain', // plain text body
    html: '<b>Hello world html</b>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send(info);
    }
  });
}