# SÈVIS-HT Security Implementation Guide

## Quick Start

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Initialize Database**
```bash
node src/init-db.ts
```

4. **Run Server**
```bash
npm run dev
```

## Security Features Implemented

### 1. Authentication & Authorization
- ✅ JWT-based authentication with expiration
- ✅ Strong password validation (12+ chars, uppercase, lowercase, numbers, special chars)
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Login rate limiting (10 attempts per 15 minutes)
- ✅ Account lockout after 5 failed attempts (15 minutes)
- ✅ Password reset with secure expiring tokens
- ✅ 2FA for admin accounts (TOTP via Google Authenticator)
- ✅ OTP verification for login
- ✅ Session management with token revocation
- ✅ Logout with session invalidation

### 2. Access Control (RBAC)
- ✅ Role-based access control (CUSTOMER, PROFESSIONAL, MODERATOR, ADMIN, SUPER_ADMIN)
- ✅ IDOR protection on all resource endpoints
- ✅ Ownership verification for data access
- ✅ Admin action confirmation requirements
- ✅ Privilege escalation prevention

### 3. Input Validation & Sanitization
- ✅ XSS protection via xss library
- ✅ Input trimming and validation
- ✅ Request size limits (1MB)
- ✅ File upload validation (MIME type + extension)
- ✅ SQL injection protection (parameterized queries)

### 4. Rate Limiting
- ✅ Authentication endpoints (10/15min)
- ✅ OTP endpoints (5/10min)
- ✅ Service creation (50/15min)
- ✅ Messaging (100/10min)
- ✅ General API (100/15min)

### 5. Security Headers
- ✅ Helmet.js with CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- ✅ CORS with origin whitelist
- ✅ Secure cookie configuration
- ✅ Referrer Policy

### 6. Data Protection
- ✅ Sensitive data filtering from audit logs
- ✅ No password/token exposure in logs
- ✅ Account status verification
- ✅ Deleted account protection
- ✅ File upload access control

### 7. API Security
- ✅ Consistent error messages (no user enumeration)
- ✅ Audit logging for all admin actions
- ✅ Webhook signature verification
- ✅ Idempotent payment operations
- ✅ Pagination limits (max 50 items)

### 8. Database Security
- ✅ PostgreSQL parameterized queries
- ✅ Foreign key constraints
- ✅ Unique constraints
- ✅ Check constraints
- ✅ Proper indexes
- ✅ Connection pooling

## Critical Environment Variables

Before deploying to production, ensure these are set:

- `JWT_SECRET` - Minimum 32 characters, cryptographically random
- `DATABASE_URL` - Secure connection string with SSL
- `NODE_ENV` - Set to "production"
- `CORS_ORIGINS` - Whitelist your frontend domain only
- `APP_URL` - Must use HTTPS in production

## API Endpoints

### Authentication
```
POST   /api/auth/register         - Create account
POST   /api/auth/login            - Login
POST   /api/auth/verify-otp       - Verify OTP
POST   /api/auth/resend-otp       - Resend OTP
GET    /api/auth/me               - Get current user
POST   /api/auth/logout           - Logout
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password
```

### Services
```
GET    /api/services              - List all services (public)
POST   /api/services/professional - Create professional profile
GET    /api/services/professional/:id - Get professional profile
PATCH  /api/services/professional/:id - Update professional profile
POST   /api/services/request      - Create service request
GET    /api/services/request/:id  - Get service request details
GET    /api/services/requests/user/:userId - Get user's requests
PATCH  /api/services/request/:id/status - Update request status
DELETE /api/services/request/:id  - Cancel request
```

### Messaging
```
GET    /api/messaging/conversations - List conversations
GET    /api/messaging/conversation/:id/messages - Get messages
POST   /api/messaging/conversation/:id/message - Send message
PATCH  /api/messaging/message/:id/read - Mark as read
```

### Admin
```
PATCH  /api/admin/users/:id/status - Change account status
PATCH  /api/admin/users/:id/role   - Change user role
GET    /api/admin/audit-logs      - View audit logs
GET    /api/admin/dashboard/stats - Dashboard statistics
```

### 2FA
```
POST   /api/2fa/setup   - Setup 2FA
POST   /api/2fa/verify  - Verify and enable 2FA
POST   /api/2fa/disable - Disable 2FA
```

## Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Generate strong JWT_SECRET (32+ chars)
- [ ] Configure DATABASE_URL with SSL connection
- [ ] Whitelist CORS_ORIGINS (no wildcards)
- [ ] Enable HTTPS for APP_URL
- [ ] Configure email service (Resend API)
- [ ] Configure SMS service (Twilio)
- [ ] Configure payment webhooks (MonCash)
- [ ] Set up database backups
- [ ] Enable database monitoring
- [ ] Configure centralized logging
- [ ] Set up error tracking (Sentry/similar)
- [ ] Configure rate limiting via Redis for multi-instance deployment
- [ ] Run security tests
- [ ] Set up CI/CD pipeline with security scanning
- [ ] Configure firewall rules
- [ ] Enable DDoS protection
- [ ] Set up audit log retention
- [ ] Document API for clients
- [ ] Create incident response plan

## Testing Security

```bash
# Run tests
npm test

# Test with security payload
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","phone":"+50935555555","password":"SecurePass@123"}'

# Test rate limiting
for i in {1..15}; do curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+50935555555","password":"wrong"}'; done
```

## Monitoring & Maintenance

- Review audit logs daily
- Monitor failed login attempts
- Check for suspended/deleted accounts
- Validate payment webhook processing
- Monitor file upload activity
- Review API rate limiting metrics
- Update dependencies monthly
- Perform security audits quarterly

## Common Issues & Solutions

### Issue: "JWT_SECRET not configured"
- Solution: Set JWT_SECRET in .env file

### Issue: CORS errors
- Solution: Add your frontend domain to CORS_ORIGINS in .env

### Issue: "Token expired" on fresh login
- Solution: Verify JWT_EXPIRES_IN format (e.g., "7d", "24h")

### Issue: File upload fails
- Solution: Ensure uploads/ directory exists and is writable

## Security Contact

For security vulnerabilities, contact: security@sevis-ht.com
