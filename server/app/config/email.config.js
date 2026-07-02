const nodemailer = require('nodemailer');
const path = require('path');

let transporter; // Declare transporter in outer scope

(async () => {
  const { default: hbs } = await import('nodemailer-express-handlebars');

  transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      layoutsDir: path.resolve('./views/'),
      partialsDir: path.resolve('./views/'),
      defaultLayout: 'template',
    },
    viewPath: path.resolve('./views/'),
  };

  transporter.use('compile', hbs(handlebarOptions));
})();

const fromEmailId = '"Notifications" <notifications@actiknow.com>';

const sendMail = async (toEmail, cc = null, subject, context, template) => {
  if (!transporter) {
    throw new Error('Transporter not initialized yet');
  }

  const mailOptions = {
    from: fromEmailId,
    to: toEmail,
    subject,
    template,
    context,
    bcc: ['shweta.sharma@actiknow.com', 'priti.rathee@actiknow.com'],
  };

  if (cc && cc !== '') {
    mailOptions.cc = cc;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
};
