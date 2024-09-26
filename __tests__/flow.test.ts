import { assertEquals } from "@std/assert";
import { create_wallet } from "@studiowebux/cardano";
import { create_key_pair, decrypt_data, encrypt_data } from "../src/mod.ts";
import { string_to_hex } from "../src/libs/utils.ts";
import { hex_to_string } from "../src/libs/utils.ts";

// Known by customer only
const user_pin = "123456";
// Vault passphrase stored in the .env
const vault_env_passphrase =
  "super_long_string_that_must_be_a_env_in_the_vault_service";
// salt saved in external DB
const user_salt =
  "passphrase_saved_with_the_user_information_so_from_external_db_than_the_vault";
const operation_env_passphrase =
  "this_key_pair_encrypts_customer_keypair_in_the_database";

const db: {
  cardano_keys: {
    id: string;
    user_id: string;
    pkey: string;
    key_hash: string;
    address_mainnet: string;
    address_preprod: string;
    address_preview: string;
    skey: string;
  }[];
  pgp_keys: {
    id: string;
    user_id: string;
    public_key: string;
    private_key: string;
    revocation_certificate: string;
  }[];
} = {
  pgp_keys: [],
  cardano_keys: [],
};

Deno.test("Proposed flow", async () => {
  // This operation keypair is set in the .env variable of the vault service
  // Goal is to protect the customer_keypair in the database.
  const operation_keypair = await create_key_pair(
    "operation_key",
    "operation_key@studiowebux.com",
    operation_env_passphrase,
  );

  // The public key must be set in the .env of the vault service
  // The private key must be stored in cold storage
  const backup_keypair = await create_key_pair(
    "backup",
    "backup@studiowebux.com",
    // This passphrase must be stored on cold storage
    "this_key_pair_should_be_store_on_cold_storage_and_only_the_public_key_should_be_here_to_act_as_a_backup_in_case_the_user_forgets_its_pin",
  );

  // The private key and revocation certificate must be encrypted using the operation_keypair
  // The passphrase is split in 3
  //  the user pin is known by the customer
  //  the vault passphrase is available in the .env of the vault service (the same for everyone)
  //  the user salt is store in the authentication db (external db) and linked with the user
  const customer_keypair = await create_key_pair(
    "tommy",
    "tommy@studiowebux.com",
    user_pin,
    vault_env_passphrase,
    user_salt,
  );

  const cardano_wallet = create_wallet(false);

  const encrypted_cardano_skey = await encrypt_data(
    cardano_wallet.skey, // Ed25519_sk...
    // Encrypt using customer keypair for day to day operation
    // Encrypt with the backup keypair as well in case the customer forgets its pin.
    // the recovery using the backup keypair must be done on cold storage only.
    [customer_keypair.public_key, backup_keypair.public_key],
  );

  db.cardano_keys.push({
    id: "MOCK",
    user_id: "MOCK",
    pkey: cardano_wallet.pkey,
    key_hash: cardano_wallet.key_hash,
    address_mainnet: cardano_wallet.address_mainnet,
    address_preprod: cardano_wallet.address_preprod,
    address_preview: cardano_wallet.address_preview,
    skey: string_to_hex(encrypted_cardano_skey),
  });

  const encrypted_pgp_private_key = await encrypt_data(
    customer_keypair.private_key,
    [operation_keypair.public_key],
  );
  const encrypted_pgp_revocation_certificate = await encrypt_data(
    customer_keypair.revocation_certificate,
    [operation_keypair.public_key],
  );

  db.pgp_keys.push({
    id: "MOCK",
    user_id: "MOCK",
    public_key: customer_keypair.public_key,
    private_key: string_to_hex(encrypted_pgp_private_key),
    revocation_certificate: string_to_hex(encrypted_pgp_revocation_certificate),
  });

  // ---

  const decrypted_pgp_private_key = await decrypt_data(
    hex_to_string(db.pgp_keys[0].private_key),
    operation_keypair.private_key,
    operation_env_passphrase,
  );

  assertEquals(decrypted_pgp_private_key, customer_keypair.private_key);

  const decrypted_cardano_skey = await decrypt_data(
    hex_to_string(db.cardano_keys[0].skey),
    decrypted_pgp_private_key,
    user_pin,
    vault_env_passphrase,
    user_salt,
  );

  assertEquals(decrypted_cardano_skey, cardano_wallet.skey);

  // console.debug("Database", db);
});
