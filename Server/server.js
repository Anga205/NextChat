import express from 'express';
import sendMail from './nodeMailer.js';

const app = express();

app.use(express.json());

const port = 8000;

app.get('/', (req,res)=>{
    res.send("Hello :)");
});


// This is to send the email verification 
app.post('/sendotp', async (req,res)=>{
       const {email} = req.body;
      
      if (!email){
              return res.status(404).json({message : "Enter mail id "});
      }
     try{
        const result = await sendMail(email);
        res.status(200).json({message : "Mail sent.",otp:result.otp});
     } catch(error){
        res.status(500).json({message :"Failed ser!",error:error.message});
  }
});


app.listen(port, ()=>{
    console.log("Server is ON..");
})
