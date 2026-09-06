# Production Deployment Guide - SÈVIS-HT

## Prerequisites

- Node.js 16+
- PostgreSQL with Neon Database
- npm or yarn
- Git
- Environment variables configured

## Step 1: Backend Deployment

### 1.1 Install Dependencies
```bash
cd backend
npm install --production
```

### 1.2 Build Database
```bash
node src/init-db.ts
```

### 1.3 Environment Setup
```bash
cp .env.example .env
# Edit .env with production values
```

**Critical Variables:**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=<32+ character random string>
JWT_EXPIRES_IN=7d
APP_URL=https://api.sevis-ht.com
CORS_ORIGINS=https://sevis-ht.com,https://www.sevis-ht.com
```

### 1.4 Start Server
```bash
# Development
npm run dev

# Production
npm start
# Or with PM2
pm2 start src/server.js --name sevis-ht-backend
```

## Step 2: Frontend Deployment

### 2.1 Install Dependencies
```bash
cd frontend
npm install --production
```

### 2.2 Environment Setup
```bash
echo "REACT_APP_API_URL=https://api.sevis-ht.com" > .env.production
```

### 2.3 Build
```bash
npm run build
```

### 2.4 Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

Or to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Step 3: Security Verification

### 3.1 Health Check
```bash
curl https://api.sevis-ht.com/api/health
```

### 3.2 Verify HTTPS
```bash
curl -I https://api.sevis-ht.com/api/health
# Check for security headers
```

### 3.3 Test Authentication
```bash
curl -X POST https://api.sevis-ht.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","phone":"+50935555555","password":"SecurePass@123"}'
```

## Step 4: Monitoring Setup

### 4.1 Error Tracking (Sentry)
```bash
# Add to backend
npm install @sentry/node

# In server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

### 4.2 Logging (Winston)
```bash
npm install winston
```

### 4.3 Performance Monitoring
- Use New Relic, DataDog, or similar
- Monitor API response times
- Alert on error rates

## Step 5: Database Backup

### 5.1 Automated Backups
- Enable Neon automated backups (30 days)
- Export to S3 weekly
- Test restore procedures

### 5.2 Backup Verification
```bash
# Monthly restore test
pg_restore -d test_db backup.dump
```

## Step 6: SSL/TLS Certificate

### Using Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.sevis-ht.com
```

### In Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.sevis-ht.com;
    
    ssl_certificate /etc/letsencrypt/live/api.sevis-ht.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sevis-ht.com/privkey.pem;
    
    # Redirect HTTP to HTTPS
    error_page 497 https://$host$request_uri;
}
```

## Step 7: Nginx Reverse Proxy

```nginx
upstream backend {
    server localhost:4000;
}

server {
    listen 80;
    server_name api.sevis-ht.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sevis-ht.com;
    
    # SSL config (see above)
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_http_version 1.1;
    }
}
```

## Step 8: Process Manager (PM2)

### Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sevis-ht-backend',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M'
  }]
};
```

### Start
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 9: Database Connection Pooling

**For multi-instance deployment, use Redis for rate limiting:**

```bash
npm install redis
```

```javascript
const redis = require('redis');
const RedisStore = require('rate-limit-redis');

const redisClient = redis.createClient();

const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 10
});
```

## Step 10: Monitoring & Alerts

### Health Check Endpoint
```bash
# Configured to run every 5 minutes
0 */5 * * * * curl https://api.sevis-ht.com/api/health || alert
```

### Alert Conditions
- API response time > 2s
- Error rate > 5%
- Database connection errors
- Failed login attempts spike
- Payment webhook failures
- File upload failures

## Troubleshooting

### Port Already in Use
```bash
lsof -i :4000
kill -9 <PID>
```

### Database Connection Failed
```bash
# Test connection
psql $DATABASE_URL

# Check credentials
echo $DATABASE_URL
```

### CORS Errors
```bash
# Verify CORS_ORIGINS
echo $CORS_ORIGINS

# Should match frontend URL exactly
```

### JWT Secret Issues
```bash
# Regenerate strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Checklist (Final)

- [ ] HTTPS enabled
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] DATABASE_URL uses SSL
- [ ] NODE_ENV=production
- [ ] CORS_ORIGINS specific (no wildcards)
- [ ] Email service configured
- [ ] SMS service configured
- [ ] Payment webhooks configured
- [ ] Database backups automated
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Rate limiting tested
- [ ] Authentication tested
- [ ] Audit logs working
- [ ] File uploads secured

## Performance Optimization

### Database
- Use connection pooling (20 connections)
- Add indexes (already done in schema)
- Regular VACUUM & ANALYZE

### Application
- Enable gzip compression
- Cache responses (Redis)
- Use CDN for static files
- Enable HTTP/2

### Frontend
- Minify and compress assets
- Use lazy loading
- Implement service worker
- Cache static assets

## Maintenance Schedule

**Daily:** Monitor error rates, review audit logs
**Weekly:** Security updates, performance review
**Monthly:** Backup verification, dependency updates
**Quarterly:** Security audit, penetration testing
**Annually:** Full security review, compliance check

---

**Deployment Date:** [Insert date]
**Next Review:** [30 days later]
**Contact:** security@sevis-ht.com
