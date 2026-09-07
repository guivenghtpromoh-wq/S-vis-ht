import { query } from './config/db';

async function init() {
  console.log("Kòmanse kreye tab yo sou Neon...");
  try {
    await query(`
      -- Users table with security columns
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'CUSTOMER',
        account_status VARCHAR(20) DEFAULT 'ACTIVE',
        is_verified BOOLEAN DEFAULT false,
        two_factor_secret VARCHAR(32),
        is_two_factor_enabled BOOLEAN DEFAULT false,
        failed_login_attempts INT DEFAULT 0,
        last_login_at TIMESTAMP,
        locked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_role CHECK (role IN ('CUSTOMER', 'PROFESSIONAL', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN')),
        CONSTRAINT valid_status CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED'))
      );

      -- Audit logs table
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        target_id UUID,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        status_code INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_actor_id (actor_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      );

      -- Password reset tokens table
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      );

      -- OTP tokens table
      CREATE TABLE IF NOT EXISTS otp_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        otp_code VARCHAR(6) NOT NULL,
        otp_type VARCHAR(20) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INT DEFAULT 0,
        max_attempts INT DEFAULT 5,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_type CHECK (otp_type IN ('EMAIL', 'SMS', 'REGISTRATION')),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      );

      -- Sessions table for token revocation
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        device_name VARCHAR(255),
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      );

      -- Professional profiles table
      CREATE TABLE IF NOT EXISTS professional_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        category_slug VARCHAR(100) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        rating DECIMAL(3,2) DEFAULT 5.0,
        verification_status VARCHAR(20) DEFAULT 'PENDING',
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_verification CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
        INDEX idx_user_id (user_id),
        INDEX idx_category_slug (category_slug)
      );

      -- Service requests table
      CREATE TABLE IF NOT EXISTS service_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE RESTRICT,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        price DECIMAL(10,2),
        payment_status VARCHAR(20) DEFAULT 'PENDING',
        payment_method VARCHAR(50),
        completed_at TIMESTAMP,
        review_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_status CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED')),
        CONSTRAINT valid_payment_status CHECK (payment_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
        INDEX idx_customer_id (customer_id),
        INDEX idx_professional_id (professional_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      );

      -- Messages/Conversations table
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
        last_message_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(customer_id, professional_id),
        INDEX idx_customer_id (customer_id),
        INDEX idx_professional_id (professional_id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at)
      );

      -- Reviews/Ratings table
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_request_id UUID NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE CASCADE,
        reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
        INDEX idx_professional_id (professional_id),
        INDEX idx_reviewer_id (reviewer_id)
      );

      -- Transactions/Payments table
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'HTG',
        payment_provider VARCHAR(50),
        provider_transaction_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'PENDING',
        payment_method VARCHAR(50),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
        INDEX idx_customer_id (customer_id),
        INDEX idx_professional_id (professional_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      );

      -- File uploads table
      CREATE TABLE IF NOT EXISTS file_uploads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL UNIQUE,
        file_size INT NOT NULL,
        mime_type VARCHAR(100),
        file_path VARCHAR(500) NOT NULL,
        entity_type VARCHAR(50),
        entity_id UUID,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_entity_type_id (entity_type, entity_id)
      );

      -- Create indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
      CREATE INDEX IF NOT EXISTS idx_professional_profiles_user_id ON professional_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON service_requests(customer_id);
      CREATE INDEX IF NOT EXISTS idx_service_requests_professional_id ON service_requests(professional_id);
    `);
    console.log("Tout tab yo kreye avèk siksè sou Neon!");
  } catch (err) {
    console.error("Erè pandan kreyasyon tab yo:", err);
  }
  process.exit();
}

init();
