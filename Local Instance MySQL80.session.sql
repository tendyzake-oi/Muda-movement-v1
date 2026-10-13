-- Jalankan file ini pada MySQL 8+ atau TiDB dengan izin membuat database.

CREATE DATABASE IF NOT EXISTS Muda_movement
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Muda_movement;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

-- Migrasi untuk database yang sudah dibuat sebelum alur satu-peran user.
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
UPDATE users SET role = 'user' WHERE role <> 'user';
