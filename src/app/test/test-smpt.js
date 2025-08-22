// // test-smtp.js
// const nodemailer = require("nodemailer");

// async function testSMTP() {
//   const transporter = nodemailer.createTransporter({
//     host: "c2660418.ferozo.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "info@naturalonline.com.ar",
//       pass: "@tG00Df9uK",
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   try {
//     await transporter.verify();
//     console.log("✅ Configuración SMTP correcta");
//   } catch (error) {
//     console.error("❌ Error SMTP:", error);
//   }
// }

// testSMTP();
