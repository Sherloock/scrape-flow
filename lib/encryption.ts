import "server-only";
import crypto from "crypto";

// Constants for encryption configuration
const ALGORITHM = "aes-256-gcm"; // Upgraded to AES-GCM for better security
const KEY_LENGTH = 32; // 32 bytes for AES-256
const SALT_LENGTH = 64; // Salt length for key derivation
const ITERATIONS = 100000; // Number of iterations for key derivation

interface EncryptedData {
	iv: string;
	encrypted: string;
	authTag: string;
	salt: string;
}

export const symmetricEncrypt = (data: string): string => {
	const encryptionKey = process.env.ENCRYPTION_KEY;

	if (!encryptionKey || encryptionKey.length !== KEY_LENGTH * 2) {
		throw new Error("Invalid encryption key configuration");
	}

	try {
		// Generate random salt for key derivation
		const salt = crypto.randomBytes(SALT_LENGTH);

		// Derive key using PBKDF2
		const derivedKey = crypto.pbkdf2Sync(
			Buffer.from(encryptionKey, "hex"),
			salt,
			ITERATIONS,
			KEY_LENGTH,
			"sha512"
		);

		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

		let encrypted = cipher.update(data, "utf8", "hex");
		encrypted += cipher.final("hex");

		// Get authentication tag
		const authTag = cipher.getAuthTag();

		const result: EncryptedData = {
			iv: iv.toString("hex"),
			encrypted,
			authTag: authTag.toString("hex"),
			salt: salt.toString("hex"),
		};

		return JSON.stringify(result);
	} catch (error) {
		throw new Error(
			`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
};

export const symmetricDecrypt = (encryptedData: string): string => {
	const encryptionKey = process.env.ENCRYPTION_KEY;

	if (!encryptionKey || encryptionKey.length !== KEY_LENGTH * 2) {
		throw new Error("Invalid encryption key configuration");
	}

	try {
		const { iv, encrypted, authTag, salt } = JSON.parse(
			encryptedData
		) as EncryptedData;

		// Derive the same key using PBKDF2
		const derivedKey = crypto.pbkdf2Sync(
			Buffer.from(encryptionKey, "hex"),
			Buffer.from(salt, "hex"),
			ITERATIONS,
			KEY_LENGTH,
			"sha512"
		);

		const decipher = crypto.createDecipheriv(
			ALGORITHM,
			derivedKey,
			Buffer.from(iv, "hex")
		);

		decipher.setAuthTag(Buffer.from(authTag, "hex"));

		let decrypted = decipher.update(encrypted, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	} catch (error) {
		throw new Error(
			`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
};
