const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

// Ensure this key is exactly 32 chars in .env, or we hash it to force 32 bytes
const getKey = () => crypto.createHash('sha256').update(String(process.env.VAULT_SECRET)).digest('base64').substr(0, 32);

exports.encrypt = (text) => {
    if (!text) return null;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

exports.decrypt = (hash) => {
    if (!hash) return null;
    const parts = hash.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};