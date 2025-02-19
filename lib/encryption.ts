import crypto from "crypto";

const ALGORITHM = "aes-256-cbc"; // AES-256-CBC is a symmetric encryption algorithm
const KEY_LENGTH = 32; // 32 bytes for AES-256
export const symmetricEncrypt = (data: string) => {
	const encryptionKey = process.env.ENCRYPTION_KEY;
	if (!encryptionKey || encryptionKey.length !== KEY_LENGTH * 2) {
		throw new Error(
			"Encryption key must be a 64-character hex string (32 bytes)"
		);
	}

	if (typeof data !== "string" || data.length === 0) {
		throw new Error("Data to encrypt must be a non-empty string");
	}

	const initVector = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		ALGORITHM,
		Buffer.from(encryptionKey, "hex"),
		initVector
	);

	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return initVector.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encryptedData: string) => {
	const encryptionKey = process.env.ENCRYPTION_KEY;
	if (!encryptionKey || encryptionKey.length !== KEY_LENGTH * 2) {
		throw new Error(
			"Encryption key must be a 64-character hex string (32 bytes)"
		);
	}

	if (typeof encryptedData !== "string" || encryptedData.length === 0) {
		throw new Error("Encrypted data must be a non-empty string");
	}

	const [initVector, encrypted] = encryptedData.split(":");

	const decipher = crypto.createDecipheriv(
		ALGORITHM,
		Buffer.from(encryptionKey, "hex"),
		Buffer.from(initVector, "hex")
	);

	let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
};
