const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: ""
    }
});

const sendEmail = async (to, subject, mess) => {
    try {
        await transporter.sendMail({
            from: "<>",
            to: to,
            subject: subject,
            html: mess
        });
        console.log("EMail send successfully");
    } catch (err) {
        console.error("Error message", err.message);
    }
}

module.exports = sendEmail;