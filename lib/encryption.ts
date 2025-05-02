import CryptoJS from "crypto-js"

const SECRET_KEY = process.env.ENCRYPTION_SECRET || "supersecretkey"

// Krypter tekst
export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

// Dekrypter tekst
export function decryptData(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
