-- Core identity tables. Phone OR email is required (enforced by CHECK).
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER'
    CHECK (role IN ('CUSTOMER', 'PROFESSIONAL', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN')),
  account_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION'
    CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  phone_verified_at TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,
  -- 2FA (TOTP). Secret is stored AES-256-GCM encrypted, never plaintext.
  two_factor_secret_enc TEXT,
  is_two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  -- Brute-force protection
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  -- Bumping this invalidates every access token issued before the bump.
  token_version INTEGER NOT NULL DEFAULT 1,
  avatar_file_id UUID,
  location VARCHAR(160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT users_contact_required CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(account_status);

-- Server-side sessions backing refresh tokens. Only a SHA-256 of the token is stored.
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash CHAR(64) UNIQUE NOT NULL,
  user_agent VARCHAR(255),
  ip_address VARCHAR(45),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- One-time codes (registration verification, login step-up, password reset).
-- Codes are stored hashed; attempts are capped; each row is single-use.
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(10) NOT NULL CHECK (channel IN ('SMS', 'EMAIL')),
  destination VARCHAR(255) NOT NULL,
  purpose VARCHAR(30) NOT NULL CHECK (purpose IN ('VERIFY_CONTACT', 'PASSWORD_RESET')),
  code_hash CHAR(64) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_lookup ON otp_codes(destination, purpose, created_at DESC);

-- Password reset tokens: hashed, expiring, single-use.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash CHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reset_user ON password_reset_tokens(user_id);

-- Private/public file metadata. Bytes live in UPLOAD_DIR under storage_key (never the client name).
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  storage_key VARCHAR(255) UNIQUE NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  visibility VARCHAR(10) NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PRIVATE', 'PUBLIC')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id);

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_avatar_fk,
  ADD CONSTRAINT users_avatar_fk FOREIGN KEY (avatar_file_id) REFERENCES files(id) ON DELETE SET NULL;

-- Admin / security audit trail.
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
