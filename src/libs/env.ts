import { load } from "dotenv";

/**
 * Defines the shape of the environment variables expected by the application.
 */
type Env = {
  /**
   * The current Node.js environment (`development` or `production`).
   */
  NODE_ENV: "development" | "production";

  /**
   * The database URL for connecting to the vault's PostgreSQL database.
   */
  VAULT_DATABASE_URL: string;

  /**
   * The operation private key used for encrypting/decrypting data to store in the database.
   */
  OPERATION_PRIVATE_KEY: string;
  OPERATION_PUBLIC_KEY: string;
  OPERATION_PASSPHRASE: string;

  /**
   * The backup public key used for recovering encrypted data if the customer keys are lost or compromised.
   */
  BACKUP_PUBLIC_KEY: string;

  /**
   * A random salt used for generating unique passphrase for customer keys.
   */
  PASSPHRASE_SALT: string;
};

/**
 * The loaded environment variables using `dotenv`.
 *
 * @example
 * console.log(env.VAULT_DATABASE_URL); // Outputs the configured database URL
 */
export const env: Env = (await load()) as Env;
