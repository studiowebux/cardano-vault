/**
 * Represents a PGP key stored in the `pgp_keys` table of the vault's database.
 */
export type PgpKey = {
  /**
   * The unique identifier (ID) of the PGP key.
   */
  id: string;

  /**
   * The email address associated with the PGP key.
   */
  email: string;

  /**
   * The full name associated with the PGP key.
   */
  name: string;

  /**
   * The public key component of the PGP key, encoded as a hexadecimal string.
   */
  public_key: string;

  /**
   * The private key component of the PGP key, encrypted using the assigned user's public key and encoded as a hexadecimal string.
   */
  private_key: string;

  /**
   * The revocation certification for the PGP key, encoded as a hexadecimal string.
   */
  revocation_certification: string;

  /**
   * The passphrase used to encrypt/decrypt the private key component of the PGP key.
   */
  passphrase: string;

  /**
   * The unique identifier (ID) of the user associated with this PGP key.
   */
  user_id: string;

  /**
   * The timestamp when the PGP key was created.
   */
  created_at: string;

  /**
   * The timestamp when the PGP key was last updated.
   */
  updated_at: string;
};

/**
 * Represents a Cardano key stored in the `cardano_keys` table of the vault's database.
 */
export type CardanoKey = {
  /**
   * The unique identifier (ID) of the Cardano key.
   */
  id: string;

  /**
   * The encrypted private key component of the Cardano key, encoded as a hexadecimal string.
   */
  skey_hex: string; // privateKey.to_hex() -> Encrypted using Public Key from assigned pgp_key

  /**
   * The public key component of the Cardano key, encoded as a hexadecimal string.
   */
  pkey_hex: string;

  /**
   * The key hash component of the Cardano key, encoded as a hexadecimal string.
   */
  key_hash: string;

  /**
   * The preview address derived from the Cardano key for testing purposes.
   */
  address_preview: string;

  /**
   * The pre-production address derived from the Cardano key for staging environments.
   */
  address_preprod: string;

  /**
   * The mainnet address derived from the Cardano key for production environments.
   */
  address_mainnet: string;

  /**
   * The unique identifier (ID) of the user associated with this Cardano key.
   */
  user_id: string;

  /**
   * The timestamp when the Cardano key was created.
   */
  created_at: string;

  /**
   * The timestamp when the Cardano key was last updated.
   */
  updated_at: string;
};
