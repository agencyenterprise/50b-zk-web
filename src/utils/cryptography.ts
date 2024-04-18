import crypto from "crypto";

export function encryptWitness(base64EnclavePublicKey: string, base64Witness: string) {
    const enclavePublicKey = Buffer.from(
      base64EnclavePublicKey,
      "base64"
    ).toString("utf-8");

    const aes_key = crypto.randomBytes(32);
    const aes_iv = crypto.randomBytes(16);
    const cipher_aes = crypto.createCipheriv("aes-256-cbc", aes_key, aes_iv);
  
    const base64EncryptedWitness = Buffer.concat([
      cipher_aes.update(Buffer.from(base64Witness, "utf8")),
      cipher_aes.final(),
    ]).toString("base64");
  
    const base64EncryptedAesKey = crypto
      .publicEncrypt(
        {
          key: enclavePublicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        aes_key
      )
      .toString("base64");
  
    return {
      base64EncryptedWitness,
      base64EncryptedAesKey,
      base64AesIv: aes_iv.toString("base64"),
    };
  }
  