import { assertEquals } from "@std/assert";
import { hex_to_string } from "../src/libs/utils.ts";
import { create_key_pair, decrypt_data, encrypt_data } from "../src/mod.ts";

const user_pin = "123456";
const vault_env_passphrase =
  "super_long_string_that_must_be_a_env_in_the_vault_service";
const user_salt =
  "passphrase_saved_with_the_user_information_so_from_external_db_than_the_vault";

Deno.test("create keypair, encrypt and decrypt data", async () => {
  const keypair = await create_key_pair(
    "tommy",
    "tommy@studiowebux.com",
    user_pin,
    vault_env_passphrase,
    user_salt,
  );

  const encrypted_data = await encrypt_data(
    JSON.stringify({ hello: "bonjour" }),
    [keypair.public_key],
  );

  const decrypted_data = await decrypt_data(
    encrypted_data,
    keypair.private_key,
    user_pin,
    vault_env_passphrase,
    user_salt,
  );

  assertEquals(JSON.parse(decrypted_data), { hello: "bonjour" });
});
