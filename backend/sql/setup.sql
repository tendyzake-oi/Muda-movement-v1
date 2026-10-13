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
  session_version INT UNSIGNED NOT NULL DEFAULT 0,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

-- Migrasi untuk database yang sudah dibuat sebelum alur satu-peran user.
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
UPDATE users SET role = 'user' WHERE role <> 'user';

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash CHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token_hash),
  UNIQUE KEY password_reset_tokens_user_unique (user_id),
  KEY password_reset_tokens_expires_at (expires_at),
  CONSTRAINT password_reset_tokens_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
