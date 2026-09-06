import { query } from './db';

async function init() {
  console.log("Kòmanse kreye tab yo sou Neon...");
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'CUSTOMER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS professional_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        category_slug VARCHAR(100) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        rating DECIMAL(3,2) DEFAULT 5.0
      );

      CREATE TABLE IF NOT EXISTS service_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES users(id),
        professional_id UUID REFERENCES professional_profiles(id),
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tout tab yo kreye avèk siksè sou Neon!");
  } catch (err) {
    console.error("Erè pandan kreyasyon tab yo:", err);
  } process.exit();
}

init();
