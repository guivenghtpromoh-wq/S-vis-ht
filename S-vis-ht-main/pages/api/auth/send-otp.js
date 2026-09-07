import { db } from '../../../lib/firebaseAdmin';
import { sendOtpEmail } from '../../../lib/emails';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metòd pa otorize' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Tanpri bay yon imèl valid.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await db.collection('otps').doc(cleanEmail).set({
      code: otpCode,
      expiresAt: expiresAt,
      createdAt: Date.now(),
    });

    await sendOtpEmail(cleanEmail, otpCode);
    return res.status(200).json({ success: true, message: 'Kòd OTP la voye nan imèl ou.' });
  } catch (error) {
    console.error('Erè send-otp:', error);
    return res.status(500).json({ success: false, message: 'Erè pandan voye OTP a.' });
  }
}
