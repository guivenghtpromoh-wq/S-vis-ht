import { db } from '../../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metòd pa otorize' });
  }

  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Imèl ak kòd yo nesesè.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const docRef = db.collection('otps').doc(cleanEmail);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({ success: false, message: 'Pa gen kòd OTP ki voye pou imèl sa a.' });
    }

    const data = doc.data();

    if (Date.now() > data.expiresAt) {
      await docRef.delete();
      return res.status(400).json({ success: false, message: 'Kòd OTP sa a ekspire.' });
    }

    if (data.code !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Kòd OTP pa bon.' });
    }

    await docRef.delete();
    return res.status(200).json({ success: true, message: 'Verifikasyon reyisi!' });
  } catch (error) {
    console.error('Erè verify-otp:', error);
    return res.status(500).json({ success: false, message: 'Erè pandan verifikasyon OTP la.' });
  }
}
