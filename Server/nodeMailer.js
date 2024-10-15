import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

async function sendMail(email){

          function otp(){
                      var num = Math.floor(Math.random() * 1000000);
                      return num.toString().padStart(6,'0');
          }

          const transporter = nodemailer.createTransport({
                        service : "gmail",
                        auth : {
                                user : process.env.GMAIL_USER,
                                pass : process.env.GMAIL_PASS
                        },
          });

          const number = otp();

          const mailOptions = {
                      from:process.env.GMAIL_USER,
                      to : email,
                      subject : "OTP VERIFICATION FROM LIVE CHAT",
                      text : ` To verify your email id, use ${number} code, \n DO not share it with anyone. `
          };
          
          try {
                const result = await transporter.sendMail(mailOptions);
                console.log("Mail sent successfully.");
                return {number}
          } catch(error){
                console.log("Failed to send the mail.",error);
                return (error);
          }
}

  export default sendMail;
