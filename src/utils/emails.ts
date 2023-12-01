import { NextRequest, NextResponse } from "next/server";

import nodeMailer from "nodemailer";
 
export const sendEmailWithNodemailer = ( emailData:any) => {
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
 
  return transporter
    .sendMail(emailData)
    .then((info:any) => {
      console.log(`Message sent: ${info.response}`);
      return NextResponse.json({ message: 'Password Incorrect.', status: false });
    })
    .catch((err:any) => console.log(`Problem sending email: ${err}`));
};
 