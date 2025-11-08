const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = process.env.TOKEN_SECRET_KEY;
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedText, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };


