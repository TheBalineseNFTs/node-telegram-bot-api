// server.js (or main server file)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { requestOTP, verifyOTP } = require('./controllers/otpController'); // Adjust the path accordingly
const { isValidPhoneNumber } = require('./utils/otpUtils'); // Adjust path as necessary

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Menyajikan file statis dari folder 'public'

// Routes
const router = express.Router();
router.post('/request', requestOTP);
router.post('/verify', verifyOTP);
app.use(router);

// New endpoint to validate phone numbers
app.post('/validate_phone', (req, res) => {
    const phone = req.body.phone;

    if (isValidPhoneNumber(phone)) {
        return res.json({ success: true, message: "Nomor telepon valid." });
    } else {
        return res.status(400).json({ success: false, message: "Nomor telepon tidak valid." });
    }
});

// Menyajikan file index.html sebagai beranda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tambahkan logika bot Telegram di sini
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Selamat datang! Kirimkan nomor telepon Anda untuk menerima OTP.");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
