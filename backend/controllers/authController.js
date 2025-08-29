const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {createUser, findUserByEmail} = require('../models/User');
const db = require('../db');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "Gmail", // Use Gmail or any SMTP service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// user signUp
exports.signUp = async (req, res) => {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("Hello");

    try {
        console.log("Processing signup...");

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const hashPassword = await bcrypt.hash(password,10);
        console.log(hashPassword);

        // Create new user
        await createUser(email, username, hashPassword);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};



// user log in
exports.login = async(req , res) => {
    const {email , password} = req.body;
    console.log("inside login");
    try{
        const user = await findUserByEmail(email);
        if(!user) return res.status(400).json({message:'Invalid Email!'});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid Email or Password!'});

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const query = 'Select username as name,id as userId from users where email=?';
        const [rows] = await db.execute(query,[email]);
        const name = rows[0].name;
        const userId = rows[0].userId;
        res.status(201).json({message:'User logged in successfully', token,name,userId});
    } catch(err){
        res.status(500).json({message:'Internal Server Error' , err});
        console.log(err);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate IITG email domain
    if (!email.endsWith("@iitg.ac.in")) {
        return res.status(400).json({ message: "Only IITG email addresses are allowed." });
    }

    // Generate a password reset token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Email content
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `Click this link to reset your password: ${resetLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send password reset email." });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, decoded.email]);

        res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(400).json({ message: "Invalid or expired token." });
    }
};

