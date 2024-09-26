import sql from "./postgres.ts";
import type { CardanoKey, PgpKey } from "./types/mod.ts";

/**
 * Saves a new PGP key to the database and returns the inserted record.
 *
 * @param {string} user_id - The ID of the user associated with the PGP key.
 * @param {{ name: string, email: string, public_key: string, private_key: string, revocation_certification: string }} data - The PGP key data to insert (excluding 'id', 'created_at', and 'updated_at').
 * @returns {Promise<Pick<PgpKey, "id" | "name" | "email" | "public_key" | "user_id">[]>} - A promise that resolves with the inserted record(s) containing the keys' metadata.
 *
 * @example
 * save_pgp_key('123', { name: 'John Doe', email: 'john@example.com', public_key: '...', private_key: '...', revocation_certification: '...' })
 *   .then(console.log)
 *   .catch(console.error);
 */
export function save_pgp_key(
  user_id: string,
  data: Omit<PgpKey, "id" | "created_at" | "updated_at">,
): Promise<Pick<PgpKey, "id" | "name" | "email" | "public_key" | "user_id">[]> {
  return sql`
    INSERT INTO pgp_keys
        (name, email, public_key, private_key, revocation_certification, user_id)
    VALUES
      (
      ${data.name},
      ${data.email},
      ${data.public_key},
      ${data.private_key},
      ${data.revocation_certification},
      ${user_id}
      )
    RETURNING id, name, email, public_key, user_id;
  `;
}

/**
 * Saves a new Cardano wallet to the database and returns the inserted record.
 *
 * @param {string} user_id - The ID of the user associated with the Cardano wallet.
 * @param {{ skey_hex: string, pkey_hex: string, key_hash: string, address_mainnet: string, address_preprod: string, address_preview: string }} data - The Cardano wallet data to insert (excluding 'id', 'created_at', and 'updated_at').
 * @returns {Promise<Pick<CardanoKey, "id" | "address_mainnet" | "address_preprod" | "address_preview" | "user_id">[]>} - A promise that resolves with the inserted record(s) containing the wallet's metadata.
 *
 * @example
 * save_cardano_wallet('123', { skey_hex: '...', pkey_hex: '...', key_hash: '...', address_mainnet: '...', address_preprod: '...', address_preview: '...' })
 *   .then(console.log)
 *   .catch(console.error);
 */
export function save_cardano_wallet(
  user_id: string,
  data: Omit<CardanoKey, "id" | "created_at" | "updated_at">,
): Promise<
  Pick<
    CardanoKey,
    "id" | "address_mainnet" | "address_preprod" | "address_preview" | "user_id"
  >[]
> {
  return sql`
    INSERT INTO cardano_keys (skey_hex, pkey_hex, key_hash, address_mainnet, address_preprod, address_preview, user_id)
    VALUES
      (
      ${data.skey_hex},
      ${data.pkey_hex},
      ${data.key_hash},
      ${data.address_mainnet},
      ${data.address_preprod},
      ${data.address_preview},
      ${user_id}
      )
    returning id, address_mainnet, address_preprod, address_preview, user_id;
  `;
}

/**
 * Retrieves the hex encoded private key for a given user's PGP key from the database.
 *
 * @param {string} user_id - The ID of the user whose private key should be retrieved.
 * @returns {Promise<Pick<PgpKey, "private_key">[]>} - A promise that resolves with an array containing the user's private key or empty if not found.
 *
 * @example
 * get_pgp_private_key('123')
 *   .then(console.log)
 *   .catch(console.error);
 */
export function get_pgp_private_key(
  user_id: string,
): Promise<Pick<PgpKey, "private_key">[]> {
  return sql`
    SELECT private_key
    FROM pgp_keys
    WHERE user_id = ${user_id}
    LIMIT 1;
  `;
}

/**
 * Retrieves the hex encoded private key for a given user's Cardano wallet from the database.
 *
 * @param {string} user_id - The ID of the user whose private key should be retrieved.
 * @returns {Promise<Pick<CardanoKey, "skey_hex">[]>} - A promise that resolves with an array containing the user's private key or empty if not found.
 *
 * @example
 * get_cardano_private_key('123')
 *   .then(console.log)
 *   .catch(console.error);
 */
export function get_cardano_private_key(
  user_id: string,
): Promise<Pick<CardanoKey, "skey_hex">[]> {
  return sql`
    SELECT skey_hex
    FROM cardano_keys
    WHERE user_id = ${user_id};
  `;
}

/**
 * Retrieves the Cardano addresses for a given user from the database.
 *
 * @param {string} user_id - The ID of the user whose addresses should be retrieved.
 * @returns {Promise<Pick<CardanoKey, "address_preview" | "address_preprod" | "address_mainnet">[]>} - A promise that resolves with an array containing the user's Cardano addresses or empty if not found.
 *
 * @example
 * get_cardano_addresses('123')
 *   .then(console.log)
 *   .catch(console.error);
 */
export function get_cardano_addresses(
  user_id: string,
): Promise<
  Pick<CardanoKey, "address_preview" | "address_preprod" | "address_mainnet">[]
> {
  return sql`
    SELECT address_preview, address_preprod, address_mainnet
    FROM cardano_keys
    WHERE user_id = ${user_id};
  `;
}
