import emailjs from '@emailjs/browser';

// Konfigirasyon kle EmailJS ou yo
const EMAILJS_SERVICE_ID = 'service_z17518s';
const EMAILJS_TEMPLATE_ID = 'template_d033cwd';
const EMAILJS_PUBLIC_KEY = 'LJrpc04zj6IIl_NTm';

/**
 * 1. Voye Kòd OTP pou Verifikasyon
 * @param {string} toEmail - Imèl itilizatè a
 * @param {string} otpCode - Kòd OTP 6 chif la
 */
export async function sendOtpEmail(toEmail, otpCode) {
  const templateParams = {
    to_email: toEmail,
    otp_code: otpCode,
    subject: 'Kòd verifikasyon ou - SÈVIS HT',
    message: `Kòd verifikasyon ou pou konekte sou SÈVIS HT se: ${otpCode}. Li ap ekspire nan 10 minit.`,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('Imèl OTP voye avèk siksè!', response.status, response.text);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('Erè nan voye imèl OTP via EmailJS:', error);
    throw new Error('Echèk nan voye imèl OTP a.');
  }
}

/**
 * 2. Voye Imèl Byenveni (Apre Kreyasyon Kont)
 */
export async function sendWelcomeEmail(toEmail, userName) {
  const templateParams = {
    to_email: toEmail,
    user_name: userName,
    subject: 'Byenveni sou SÈVIS HT!',
    message: `Bonswa ${userName}, nou kontan genyen w nan kominote SÈVIS HT a!`,
  };

  try {
    return await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
  } catch (error) {
    console.error('Erè imèl byenveni:', error);
  }
}

/**
 * 3. Voye Notifikasyon Mesaj Reyèl
 */
export async function sendMessageNotificationEmail(toEmail, senderName, messagePreview) {
  const templateParams = {
    to_email: toEmail,
    sender_name: senderName,
    subject: `Nouvo mesaj soti nan ${senderName} - SÈVIS HT`,
    message: `${senderName} voye yon mesaj ba ou: "${messagePreview}"`,
  };

  try {
    return await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
  } catch (error) {
    console.error('Erè notifikasyon mesaj:', error);
  }
}
