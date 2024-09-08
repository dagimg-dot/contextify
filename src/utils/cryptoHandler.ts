import { db } from "@/services/db";

// Hardcoded key for encryption/decryption (not secure, but simple)
const hardcodedKey = new TextEncoder().encode(
  "my-very-secret-key-32bytes-long!"
); // 32-byte key

// Convert hardcoded key to CryptoKey format (used by Web Crypto API)
async function getFixedKey(): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "raw",
    hardcodedKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt function
async function encrypt(
  text: string
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate random IV

  const key = await getFixedKey(); // Get the fixed key

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv, // Use the random IV
    },
    key, // Fixed key
    enc.encode(text) // Text to encrypt
  );

  return { encryptedData, iv }; // Return encrypted data and IV
}

// Decrypt function
async function decrypt(
  encryptedData: ArrayBuffer,
  iv: Uint8Array
): Promise<string> {
  const key = await getFixedKey(); // Get the fixed key

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv, // Use the same IV that was used during encryption
    },
    key, // Fixed key
    encryptedData
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedData); // Return the decrypted text
}

const getDecryptedKey = async () => {
  const settings = await db.settings.toArray();
  if (settings.length > 0) {
    const key = await decrypt(settings[0].enctyptedKey, settings[0].iv);
    return key;
  } else {
    return "";
  }
};

export { encrypt, decrypt, getDecryptedKey };
