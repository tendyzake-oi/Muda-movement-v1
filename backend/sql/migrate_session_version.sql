-- Run once on existing databases to enable session revocation after password changes.
ALTER TABLE users
  ADD COLUMN session_version INT UNSIGNED NOT NULL DEFAULT 0;
