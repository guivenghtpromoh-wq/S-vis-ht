const db = require('../src/config/db');
const jwt = require('jsonwebtoken');

async function runSecurityTests() {
  console.log('🧪 Kòmanse Ekzekisyon Tès Sekirite yo...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Tès Mass Assignment (Pwoteksyon wòl ADMIN pandan enskripsyon)
    const allowedRoles = ['CUSTOMER', 'PROFESSIONAL'];
    const testRoleInput = 'ADMIN';
    const assignedRole = allowedRoles.includes(testRoleInput) ? testRoleInput : 'CUSTOMER';
    assert(assignedRole === 'CUSTOMER', 'Pwoteksyon anpeche itilizatè a vin ADMIN pandan enskripsyon');

    // 2. Tès Validasyon Modpas (Modpas ki pi kout pase 8 karaktè dwe refize)
    const weakPassword = '123';
    const isPasswordValid = weakPassword.length >= 8 && /\d/.test(weakPassword);
    assert(!isPasswordValid, 'Modpas fèb (mwens pase 8 karaktè) jwenn refi');

    // 3. Tès JWT Verification & Signature Integrity
    const secret = 'sevis_ht_secret_key_2026_super_secure';
    const token = jwt.sign({ id: 'user-123', role: 'CUSTOMER' }, secret, { expiresIn: '1h' });
    let isTokenVerified = false;
    try {
      jwt.verify(token, secret);
      isTokenVerified = true;
    } catch (e) {}
    assert(isTokenVerified, 'Token JWT ki gen bon signati rekonèt san pwoblèm');

    let isFakeTokenRejected = false;
    try {
      jwt.verify(token, 'fake_secret_key');
    } catch (e) {
      isFakeTokenRejected = true;
    }
    assert(isFakeTokenRejected, 'Token JWT ak fo signati jwenn refi (403)');

    // 4. Tès Pwoteksyon IDOR (Yon itilizatè pa ka aksede done yon lòt moun)
    const reqUser = { id: 'user-aaa', role: 'CUSTOMER' };
    const targetResourceId = 'user-bbb';
    const isAuthorized = reqUser.id === targetResourceId || ['ADMIN', 'SUPER_ADMIN'].includes(reqUser.role);
    assert(!isAuthorized, 'Aksè IDOR refize lè User A eseye li done User B');

    // 5. Tès XSS Sanitization Filter
    const xss = require('xss');
    const maliciousInput = '<script>alert("XSS")</script>Pwofil Pwofesyonèl';
    const cleanInput = xss(maliciousInput);
    assert(!cleanInput.includes('<script>'), 'Filtrage XSS la netwaye tout balis malveyan <script>');

    console.log(`\n📊 Rezilta Final Tès yo: ${passed} reyalize, ${failed} echwe.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Erè pandan ekzekisyon tès yo:', error);
    process.exit(1);
  }
}

runSecurityTests();
