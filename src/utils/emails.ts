import nodeMailer from "nodemailer";
 
export const sendEmailWithNodemailer = async (emailData: any) => {
  const transporter = nodeMailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  try {
    const info = await transporter.sendMail(emailData);
    console.log(`Message sent: ${info.response}`);
    return info;
  } catch (error:any) {
    console.error(`Problem sending email: ${error.message}`);
    throw error;
  }
};

 