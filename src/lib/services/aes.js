import nacl from 'tweetnacl';
import * as msgpack from '@msgpack/msgpack';

if (!Symbol.dispose) {
    Symbol.dispose = Symbol("Symbol.dispose");
}

// Generate a 32-byte secret key (store this securely!)
const SECRET_KEY = Uint8Array.from([164,86,67,58,158,104,77,9,246,66,229,190,134,116,19,37,30,251,54,96,149,254,180,66,141,180,50,208,52,107,186,38]);
// nacl.randomBytes(32);

// Encrypt function (ChaCha20 + MessagePack)
export function encryptionData(data) {
	const packed = msgpack.encode(data); // Compress JSON
	const nonce = nacl.randomBytes(24); // Generate nonce
	const encrypted = nacl.secretbox(packed, nonce, SECRET_KEY); // Encrypt data
	return Buffer.concat([nonce, Buffer.from(encrypted)]).toString('base64'); // Shorten output
}

// Decrypt function
export function decryptiedData(encryptedBase64) {
	const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
	const nonce = encryptedBuffer.slice(0, 24); // Extract nonce
	const encrypted = encryptedBuffer.slice(24); // Extract encrypted data
	const decrypted = nacl.secretbox.open(encrypted, nonce, SECRET_KEY);
	return decrypted ? msgpack.decode(decrypted) : null; // Decode MessagePack
}
