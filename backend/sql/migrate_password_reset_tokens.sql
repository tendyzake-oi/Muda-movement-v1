-- Run once on databases that do not yet have the password reset token table.
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
