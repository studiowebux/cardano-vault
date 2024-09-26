DROP DATABASE IF EXISTS vault;
CREATE DATABASE vault;
-- \c vault;

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE pgp_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name CITEXT NOT NULL,
    email CITEXT NOT NULL,
    public_key CITEXT NOT NULL,
    private_key CITEXT NOT NULL,
    revocation_certification CITEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE pgp_keys ADD UNIQUE (name, email, user_id);

CREATE TABLE cardano_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skey_hex CITEXT NOT NULL, -- privateKey.to_hex() -> Encrypted using Public Key from assigned pgp_key
    pkey_hex CITEXT NOT NULL, -- publicKey.to_hex()
    key_hash CITEXT NOT NULL, -- keyHash.to_hex()
    address_preview CITEXT NOT NULL,
    address_preprod CITEXT NOT NULL,
    address_mainnet CITEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cardano_keys ADD UNIQUE (address_mainnet, user_id);
