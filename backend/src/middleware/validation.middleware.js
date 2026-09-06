const xss = require('xss');

// Sanitizer pou netwaye tout JSON body kont XSS
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key].trim());
      }
    }
  }
  next();
};

// Validasyon Done Enskripsyon
const validateRegistration = (req, res, next) => {
  const { fullName, phone, password } = req.body;

  if (!fullName || fullName.length < 2) {
    return res.status(400).json({ error: 'Non an dwe gen omwen 2 karaktè.' });
  }

  // Regex senp pou nimewo telefòn (Haiti / Enfòmatik)
  const phoneRegex = /^[0-9+\s-]{8,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Nimewo telefòn lan pa valid.' });
  }

  // Seulman modpas ki gen omwen 8 karaktè ak yon chif
  if (!password || password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Modpas la dwe gen omwen 8 karaktè epi gen yon chif nan li.' });
  }

  next();
};

module.exports = {
  sanitizeInput,
  validateRegistration
};
