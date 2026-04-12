const {ObjectId} = require("mongodb");
const User = require("../models/auth");
const sendEmail = require("../utils/mailer");

exports.postSignup = async (req, res, next) => {
    let {fname , lname, username, email, password} = req.body;

    const find = await User.findbyEmail(email);
    const findusername = await User.findbyUsername(username);
    
    if (find) {
      res.json({status: false});
    } else if (findusername) {
      res.json({message: "username already exists"});
    } else {
    const user = new User(fname, lname, username, email, password);
//     const Email = await sendEmail(user.email, "Welcome to SKILLSWAP – Start Exchanging Skills 🚀",
//          `
//          <body style="margin:0;padding:0;background-color:#05060c;font-family:Arial,Helvetica,sans-serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#05060c;padding:30px 0;">
//     <tr>
//       <td align="center">
//     <!-- MAIN CARD -->
//     <table width="600" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:14px;padding:32px;color:#ffffff;">
      
//       <!-- LOGO -->
//       <tr>
//         <td style="text-align:center;padding-bottom:20px;">
//           <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">
//             Skill<span style="color:#00f5ff;">Swap</span>
//           </h1>
//         </td>
//       </tr>

//       <!-- TITLE -->
//       <tr>
//         <td style="padding-bottom:12px;">
//           <h2 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
//             Welcome <strong>${user.fname}</strong> to SKILLSWAP 👋
//           </h2>
//         </td>
//       </tr>

//       <!-- MESSAGE -->
//       <tr>
//         <td style="padding-bottom:22px;font-size:14px;line-height:1.6;color:#cfd8ff;">
//           Hi there,<br><br>
//           We’re excited to have you on <strong>SkillSwap</strong> — a next-generation platform
//           where students exchange real skills instead of money.
//           <br><br>
//           Learn faster, collaborate smarter, and grow with peers across campuses.
//         </td>
//       </tr>

//       <!-- CTA BUTTON -->
//       <tr>
//         <td align="center" style="padding:20px 0;">
//           <a href="{{APP_URL}}" 
//              style="display:inline-block;padding:14px 32px;
//              background:linear-gradient(135deg,#00f5ff,#6f00ff);
//              color:#05060c;text-decoration:none;
//              border-radius:30px;font-weight:700;font-size:14px;">
//             Get Started on SkillSwap
//           </a>
//         </td>
//       </tr>

//       <!-- FEATURES -->
//       <tr>
//         <td style="padding:20px 0;font-size:13px;color:#b8c0ff;">
//           🔹 Swap skills, not money<br>
//           🔹 Connect with students & hostellers<br>
//           🔹 Build real-world experience
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;font-size:12px;color:#9aa4ff;">
//           If you didn’t create this account, you can safely ignore this email.
//           <br><br>
//           © 2026 SkillSwap. All rights reserved.
//         </td>
//       </tr>

//     </table>

//   </td>
// </tr>

//   </table>

// </body>
//          `);
    const result = await user.userSave();
    res.json({result, status: true});
}
}

exports.postLogin = async (req, res, next) => {
    const data = req.body;
    const user = await User.findbyEmail(data.email);
    if (!user) {
        res.json({status:false});
    } else if(user.password == data.password) {
//         const Email = await sendEmail(user.email, "New Login Detected 🔐", 
//             `
// <body style="margin:0;padding:0;background-color:#05060c;font-family:Arial,Helvetica,sans-serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#05060c;padding:30px 0;">
//     <tr>
//       <td align="center">
//     <!-- MAIN CARD -->
//     <table width="600" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:14px;padding:32px;color:#ffffff;">
      
//       <!-- LOGO -->
//       <tr>
//         <td style="text-align:center;padding-bottom:20px;">
//           <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">
//             Skill<span style="color:#00f5ff;">Swap</span>
//           </h1>
//         </td>
//       </tr>

//       <!-- TITLE -->
//       <tr>
//         <td style="padding-bottom:12px;">
//           <h2 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
//             New Login Detected 🔐
//           </h2>
//         </td>
//       </tr>

//       <!-- MESSAGE -->
//       <tr>
//         <td style="padding-bottom:22px;font-size:14px;line-height:1.6;color:#cfd8ff;">
//           Hi <strong>${user.fname}</strong>,<br><br>
//           We noticed a successful login to your <strong>SkillSwap</strong> account.
//           If this was you, no action is needed.
//         </td>
//       </tr>

//       <!-- CTA -->
//       <tr>
//         <td align="center" style="padding:22px 0;">
//           <a href="/home" 
//              style="display:inline-block;padding:13px 30px;
//              background:linear-gradient(135deg,#00f5ff,#6f00ff);
//              color:#05060c;text-decoration:none;
//              border-radius:30px;font-weight:700;font-size:14px;">
//             Go to SkillSwap
//           </a>
//         </td>
//       </tr>

//       <!-- SECURITY NOTE -->
//       <tr>
//         <td style="font-size:13px;color:#b8c0ff;padding-bottom:18px;">
//           ⚠️ If you don’t recognize this activity, please reset your password immediately
//           and contact our support team.
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;font-size:12px;color:#9aa4ff;">
//           This email was sent to keep your account secure.<br><br>
//           ©${new Date().getFullYear()} 2026 SkillSwap. All rights reserved.
//         </td>
//       </tr>

//     </table>

//   </td>
// </tr>

//   </table>

// </body>
// `)
       
        // req.session.isLoggedIn = true;
        res.json( {user, status:true});
    } else {
        res.json({
            message:"Password Invalid"
        })
    }
};

exports.logout = async (req, res, next) => {
  res.json(req.session.isLoggedIn = false);
  console.log("Logout successfully");
}

let otp;

exports.forgetPass = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findbyEmail(email);
    console.log("Found user for otp in backend", user);
    if(!user){
        res.json({
            status: false
        })
    } else {
        otp = Math.floor(100000 + Math.random() * 600000);
//         const Email = sendEmail(user.email, "Verify Your Email Address – SKILLSWAP", 
//             `
//             <body style="margin:0;padding:0;background-color:#05060c;font-family:Arial,Helvetica,sans-serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#05060c;padding:30px 0;">
//     <tr>
//       <td align="center">
//     <!-- MAIN CONTAINER -->
//     <table width="600" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:14px;padding:36px;color:#ffffff;">

//       <!-- LOGO -->
//       <tr>
//         <td align="center" style="padding-bottom:22px;">
//           <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">
//             Skill<span style="color:#00f5ff;">Swap</span>
//           </h1>
//         </td>
//       </tr>

//       <!-- TITLE -->
//       <tr>
//         <td style="padding-bottom:14px;">
//           <h2 style="margin:0;font-size:22px;font-weight:700;">
//             Verify Your Email Address ✉️
//           </h2>
//         </td>
//       </tr>

//       <!-- MESSAGE -->
//       <tr>
//         <td style="font-size:14px;line-height:1.7;color:#cfd8ff;padding-bottom:26px;">
//           Hi,<br><br>
//           Thanks for signing up on <strong>SkillSwap</strong> 🎉  
//           To complete your registration and keep your account secure, please
//           verify your email address using the OTP below.
//         </td>
//       </tr>

//       <!-- OTP BOX -->
//       <tr>
//         <td align="center" style="padding:20px 0;">
//           <div style="
//             display:inline-block;
//             padding:16px 36px;
//             background:linear-gradient(135deg,#00f5ff,#6f00ff);
//             color:#05060c;
//             border-radius:14px;
//             font-size:26px;
//             font-weight:700;
//             letter-spacing:6px;">
//             ${otp}
//           </div>
//         </td>
//       </tr>

//       <!-- OTP INFO -->
//       <tr>
//         <td style="font-size:13px;color:#b8c0ff;padding-bottom:22px;">
//           ⏳ This OTP is valid for <strong>10 minutes</strong>.<br>
//           ⚠️ Do not share this code with anyone for your safety.
//         </td>
//       </tr>

//       <!-- CTA (OPTIONAL) -->
//       <tr>
//         <td align="center" style="padding-bottom:28px;">
//           <a href="{{APP_URL}}" 
//              style="
//              display:inline-block;
//              padding:12px 30px;
//              background:rgba(255,255,255,0.12);
//              color:#00f5ff;
//              text-decoration:none;
//              border-radius:24px;
//              font-size:13px;
//              font-weight:600;">
//             Go to SkillSwap
//           </a>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:18px;font-size:12px;color:#9aa4ff;">
//           If you didn’t request this email, you can safely ignore it.<br><br>
//           ©${new Date().getFullYear()} 2026 SkillSwap. All rights reserved.
//         </td>
//       </tr>

//     </table>

//   </td>
// </tr>
//   </table>

// </body>
//             `)
    }

    res.json({id: user._id, status: true});
};

exports.enterOtp = async (req, res, next) => {
  const data = req.body;
  console.log("Otp in backend is", data);
  if(data.otp == otp ){
    res.json({status: true});
  } else {
    res.json({status: false});
  }
};

exports.newpass = async (req, res, next) => {
  const id = req.params.id;
  const {password} = req.body;

  const result = await User.updatePass(password, id);
  console.log("Updated Succesfully", result);
  res.json(result);
};