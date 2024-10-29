// utils/otpUtils.js

function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit OTP
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+62[0-9]{10,13}$/; // Example regex for Indonesian phone numbers
    return phoneRegex.test(phone);
}

module.exports = { generateOTP, isValidPhoneNumber };
