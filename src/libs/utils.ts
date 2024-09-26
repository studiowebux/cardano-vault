import { Buffer } from "node:buffer";

/**
 * Converts a UTF-8 string to its hexadecimal representation using Buffer.
 *
 * @param {string} data - The input UTF-8 string.
 * @returns {string} The hexadecimal representation of the input string.
 *
 * @example
 * console.log(string_to_hex("Hello, World!")); // Outputs: "48656c6c6f2c20576f726c6421"
 */
export function string_to_hex(data: string): string {
  return Buffer.from(data).toString("hex");
}

/**
 * Converts a hexadecimal string to its UTF-8 string representation using Buffer.
 *
 * @param {string} data - The input hexadecimal string.
 * @returns {string} The UTF-8 string representation of the input hexadecimal string.
 *
 * @example
 * console.log(hex_to_string("48656c6c6f2c20576f726c6421")); // Outputs: "Hello, World!"
 */
export function hex_to_string(data: string): string {
  return Buffer.from(data, "hex").toString();
}
