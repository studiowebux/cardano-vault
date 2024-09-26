import * as openpgp from "openpgp";
import { hex_to_string, string_to_hex } from "../mod.ts";

/**
 * Generates a new PGP key pair with the given user credentials and passphrases.
 *
 * @param {string} name - The full name associated with the key.
 * @param {string} email - The email address associated with the key.
 * @param {string} user_pin - The user's PIN used for encrypting/decrypting keys.
 * @param {string} [vault_passphrase=""] - An optional vault passphrase to strengthen encryption (default: "").
 * @param {string} [external_passphrase=""] - An optional external passphrase provided by the user (default: "").
 * @returns {Promise<{
 *   private_key: string;
 *   public_key: string;
 *   revocation_certificate: string;
 * }>} - A promise that resolves with an object containing:
 *
 *  - `private_key`: The hex-encoded private key.
 *  - `public_key`: The hex-encoded public key.
 *  - `revocation_certificate`: The hex-encoded revocation certificate.
 *
 * @example
 * create_key_pair('John Doe', 'john@example.com', '1234')
 *   .then(console.log)
 *   .catch(console.error);
 */
export async function create_key_pair(
  name: string,
  email: string,
  user_pin: string,
  vault_passphrase: string = "",
  external_passphrase: string = "",
): Promise<{
  private_key: string;
  public_key: string;
  revocation_certificate: string;
}> {
  const { privateKey, publicKey, revocationCertificate } =
    await openpgp.generateKey({
      type: "ecc",
      curve: "curve25519",
      userIDs: [{ name, email }],
      passphrase: user_pin + vault_passphrase + external_passphrase,
      format: "armored",
    });

  return {
    private_key: string_to_hex(privateKey),
    public_key: string_to_hex(publicKey),
    revocation_certificate: string_to_hex(revocationCertificate),
  };
}

/**
 * Encrypts plaintext data using the provided PGP public keys.
 *
 * @param {string} input - The plaintext data to encrypt.
 * @param {string[]} hex_encoded_public_keys - An array of hex-encoded public keys used for encryption.
 * @returns {Promise<string>} A promise that resolves with the armored encrypted message.
 *
 * @example
 * encrypt_data("Hello, World!", ["3080...", "7c5f..."])
 *   .then(console.log)
 *   .catch(console.error);
 */
export async function encrypt_data(
  input: string,
  hex_encoded_public_keys: string[],
): Promise<string> {
  const encryption_keys = await Promise.all(
    hex_encoded_public_keys.map((public_key) =>
      openpgp.readKey({
        armoredKey: hex_to_string(public_key),
      }),
    ),
  );
  const message = await openpgp.createMessage({ text: input });
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: encryption_keys,
  });

  return encrypted;
}

/**
 * Decrypts armored encrypted data using the provided PGP private key and passphrases.
 *
 * @param {string} input - The armored encrypted message to decrypt.
 * @param {string} hex_encoded_private_key - The hex-encoded private key used for decryption.
 * @param {string} user_pin - The user's PIN used for encrypting/decrypting keys.
 * @param {string} [vault_passphrase=""] - An optional vault passphrase to strengthen encryption (default: "").
 * @param {string} [external_passphrase=""] - An optional external passphrase provided by the user (default: "").
 * @returns {Promise<string>} A promise that resolves with the decrypted plaintext data.
 *
 * @example
 * decrypt_data("-----BEGIN MESSAGE-----...", "3080...", "1234")
 *   .then(console.log)
 *   .catch(console.error);
 */
export async function decrypt_data(
  input: string,
  hex_encoded_private_key: string,
  user_pin: string,
  vault_passphrase: string = "",
  external_passphrase: string = "",
): Promise<string> {
  const decryption_key = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({
      armoredKey: hex_to_string(hex_encoded_private_key),
    }),
    passphrase: user_pin + vault_passphrase + external_passphrase,
  });

  const message = await openpgp.readMessage({
    armoredMessage: input,
  });

  const { data } = await openpgp.decrypt({
    message,
    decryptionKeys: decryption_key,
  });

  return data;
}
