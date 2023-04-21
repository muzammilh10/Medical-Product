const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  let transporter = nodemailer.createTransport({
    host: process.env.Email_HOST,
    port: process.env.Email_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });


  // var transporter = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "553cb6ea9e3ed3",
  //     pass: "51b3fe526846e8"
  //   }
  // });



  // 2) Define the email options
  const mailOptions = {
    from: 'Muzammil Hasan <hasanmuzammil2812@gmail.com>',
    to: options.email,
    subject: 'Registration Successful', // email subject
    html: `
      <h1>Welcome to MyApp</h1>
      <p>Thank you for registering with MyApp. Here are your login credentials:</p>
      <p>name: ${options.username}</p>
      <p>password: ${options.password}</p>
     
      <p>Please keep this information secure and do not share it with anyone.</p>
      <p>Thank you for using MyApp!</p>
    ` 
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;