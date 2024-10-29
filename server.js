// server.js (or main server file)
const express = require('express');
const bodyParser = require('body-parser');
const { requestOTP, verifyOTP } = require('./controllers/otpController'); // Adjust the path accordingly
const { isValidPhoneNumber } = require('./utils/otpUtils'); // Adjust path as necessary

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/request_otp', requestOTP);
app.post('/verify_otp', verifyOTP);

// New endpoint to validate phone numbers
app.post('/validate_phone', (req, res) => {
    const phone = req.body.phone;

    if (isValidPhoneNumber(phone)) {
        return res.json({ success: true, message: "Nomor telepon valid." });
    } else {
        return res.status(400).json({ success: false, message: "Nomor telepon tidak valid." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Tambahkan logika bot Telegram di sini
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Selamat datang! Kirimkan nomor telepon Anda untuk menerima OTP.");
});
