// frontend/src/utils/security.js - Input validation and sanitization

import DOMPurify from 'dompurify';

export class SecurityUtils {
  // Validate phone number
  static validatePhone(phone) {
    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    return phoneRegex.test(phone);
  }

  // Validate email
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password) {
    if (password.length < 12) return false;
    if (!/[a-z]/.test(password)) return false; // lowercase
    if (!/[A-Z]/.test(password)) return false; // uppercase
    if (!/\d/.test(password)) return false; // number
    if (!/[@$!%*?&]/.test(password)) return false; // special char
    return true;
  }

  // Sanitize HTML/user input to prevent XSS
  static sanitizeHTML(dirty) {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
      ALLOWED_ATTR: [],
    });
  }

  // Escape HTML entities
  static escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  // Validate file upload
  static validateFile(file) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tip fichiye sa a pa otorize.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Fichiye a twòp gro (max 5MB).' };
    }

    return { valid: true };
  }

  // Validate form input
  static validateInput(value, type = 'text', required = true) {
    if (required && (!value || value.trim().length === 0)) {
      return { valid: false, error: 'Cha obliga.' };
    }

    if (!required && (!value || value.trim().length === 0)) {
      return { valid: true };
    }

    switch (type) {
      case 'email':
        return this.validateEmail(value)
          ? { valid: true }
          : { valid: false, error: 'Adrès imel pa valid.' };
      case 'phone':
        return this.validatePhone(value)
          ? { valid: true }
          : { valid: false, error: 'Nimewo telefòn pa valid.' };
      case 'password':
        return this.validatePassword(value)
          ? { valid: true }
          : {
              valid: false,
              error:
                'Modpas la dwe gen omwen 12 karaktè, yon majiskil, yon miniskil, yon chif, ak yon karaktè espesyal (@$!%*?&).',
            };
      default:
        return { valid: true };
    }
  }
}

export default SecurityUtils;
