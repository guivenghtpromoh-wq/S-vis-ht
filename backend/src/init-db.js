const db = require('./config/db');

async function initDb() {
  console.log('🔒 Kòmanse konfigirasyon baz de done an sekirite sou Neon...');
  try {
    // 1. Tab Users ak Kontrent Wòl ak Sati Kont
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' 
          CHECK (role IN ('CUSTOMER', 'PROFESSIONAL', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN')),
        account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
          CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tab Pwofil Pwofesyonèl
    await db.query(`
      CREATE TABLE IF NOT EXISTS professional_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        category_slug VARCHAR(100) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL CHECK (starting_price >= 0),
        is_available BOOLEAN DEFAULT true,
        rating DECIMAL(3,2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tab Demann Sèvis
    await db.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE RESTRICT,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Tab Audit Logs pou Aksyon Administratif
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        target_id VARCHAR(255),
        details JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Endèks pou Pèfòmans ak Anti-DoS
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_services_category ON professional_profiles(category_slug);
      CREATE INDEX IF NOT EXISTS idx_requests_customer ON service_requests(customer_id);
      CREATE INDEX IF NOT EXISTS idx_requests_professional ON service_requests(professional_id);
    `);

    console.log('✅ Baz de done SÈVIS HT monte ak tout sekirite sou Neon!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erè pandan inisyalizasyon baz de done a:', err);
    process.exit(1);
  }
}

initDb();
