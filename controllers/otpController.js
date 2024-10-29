// otpControllers.js
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { generateOTP, isValidPhoneNumber } = require('../utils/otpUtils'); // Sesuaikan dengan jalur yang benar

const otpStore = new Map(); // Menyimpan OTP
const chatSessions = new Map(); // Menyimpan sesi chat untuk menyimpan nomor telepon
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Endpoint untuk permintaan OTP
app.post('/request_otp', (req, res) => {
    const phone = req.body.phone;

    // Validasi nomor telepon
    if (!isValidPhoneNumber(phone)) {
        return res.status(400).json({ success: false, message: "Nomor telepon tidak valid." });
    }

    const otp = generateOTP();
    otpStore.set(phone, otp);
    chatSessions.set(phone, true); // Menyimpan sesi chat
    console.log(`OTP untuk ${phone}: ${otp}`);
    
    // Mengirimkan OTP ke pengguna melalui Telegram
    bot.sendMessage(phone, `Kode OTP Anda adalah: ${otp}`)
        .then(() => {
            res.json({ success: true, message: "OTP telah dikirim." });
        })
        .catch((error) => {
            console.error("Gagal mengirim OTP:", error);
            res.status(500).json({ success: false, message: "Gagal mengirim OTP." });
        });
});

// Endpoint untuk memverifikasi OTP
app.post('/verify_otp', (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = otpStore.get(phone);

    if (otp === storedOtp) {
        otpStore.delete(phone);
        res.json({ success: true, message: "Verifikasi berhasil." });
    } else {
        res.status(400).json({ success: false, message: "OTP tidak valid." });
    }
});

// Menangani webhook dari Telegram
app.post('/controllers', (req, res) => {
    const body = req.body;

    if (body.message) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        switch (text) {
            case '/start':
                bot.sendMessage(chatId, "Selamat datang! Kirimkan nomor telepon Anda untuk menerima OTP.");
                break;
            case '/list':
                // Menampilkan nomor telepon yang terdaftar
                const registeredPhones = Array.from(chatSessions.keys());
                if (registeredPhones.length > 0) {
                    bot.sendMessage(chatId, `Nomor telepon yang terdaftar: ${registeredPhones.join(', ')}`);
                } else {
                    bot.sendMessage(chatId, "Tidak ada nomor telepon terdaftar.");
                }
                break;
            case '/getotp':
                // Mengirimkan OTP untuk semua nomor telepon terdaftar
                registeredPhones.forEach(phone => {
                    const otp = otpStore.get(phone);
                    if (otp) {
                        bot.sendMessage(chatId, `OTP untuk ${phone}: ${otp}`);
                    }
                });
                break;
            case '/exit':
                // Menghapus semua sesi
                chatSessions.clear();
                otpStore.clear();
                bot.sendMessage(chatId, "Semua sesi telah dihapus.");
                break;
            default:
                bot.sendMessage(chatId, `Anda mengirim: ${text}`);
        }
    }

    res.sendStatus(200);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
