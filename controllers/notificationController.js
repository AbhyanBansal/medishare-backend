// controllers/notificationController.js
const nodemailer = require('nodemailer');

// Configure nodemailer transporter with no-reply email
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "noreply.medishare@gmail.com",
      pass: "uqxgiaxixvdorotp",
    },
  });
const notificationController = {
  async sendNotification(req, res) {
    // try {
      const { recipientEmail, medicineName, senderInfo} = req.body;
      console.log(req.body);

      // Validate required fields
      if (!recipientEmail || !medicineName || !senderInfo ) {
        return res.status(400).json({
          success: false,
          message: 'Missing required information.'
        });


    }
    
    try{
        // send mail with defined transport object
const info = await transporter.sendMail({
from: 'abansal_be22@thapar.edu', // sender address
to: recipientEmail, // list of receivers
subject:'MediShare: New Medicine Request', // Subject line
text: "Hello world?", // plain text body
html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #42817c;">Medicine Request Notification</h2>
  <p>Hello,</p>
  <p>A user is interested in the medicine you shared: <strong>${medicineName}</strong></p>
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
    <h3>Requester Details:</h3>
    <ul style="list-style: none; padding-left: 0;">
      <li><strong>Name:</strong> ${senderInfo.name}</li>
      <li><strong>Email:</strong> ${senderInfo.email}</li>
      <li><strong>Phone:</strong> ${senderInfo.phone}</li>
      <li><strong>Hostel:</strong> ${senderInfo.hostel}</li>
      <li><strong>Room:</strong> ${senderInfo.roomNumber}</li>
    </ul>
  </div>
  <p>To respond, please reply directly to the sender's email.</p>
  <br>
  <p>Best regards,</p>
  <p><strong>MediShare Team</strong></p>
  <hr>
  <p style="font-size: 12px; color: #666;">
    This is an automated notification from MediShare. Please do not reply to this email address.
  </p>
</div>
`, // html body
});

    if(info != null){
        console.log("success email sent")
    }
   } catch(e){
       console.log(e); 
   }
      
    
  }
};

module.exports = notificationController;