function requestOTP() {
    const phone = document.getElementById('phone').value;

    if (!phone) {
        alert('Harap masukkan nomor telepon');
        return;
    }

    fetch('/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('message').textContent = 'OTP telah dikirim ke nomor telepon Anda.';
        } else {
            document.getElementById('message').textContent = 'Gagal mengirim OTP.';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Terjadi kesalahan.';
        console.error('Error:', error);
    });
}

function verifyOTP() {
    const phone = document.getElementById('phone').value;
    const otp = document.getElementById('otp').value;

    if (!otp) {
        alert('Harap masukkan OTP');
        return;
    }

    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('message').textContent = 'OTP berhasil diverifikasi.';
        } else {
            document.getElementById('message').textContent = 'OTP tidak valid atau salah.';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Terjadi kesalahan saat verifikasi.';
        console.error('Error:', error);
    });
}
