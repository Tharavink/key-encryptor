import {
	KeyObject,
	createPrivateKey,
	createPublicKey,
	createSign,
	generateKeyPairSync,
} from "crypto";
import { CryptorService, KeyPair } from "../cryptor.interface";

class RsaCryptor implements CryptorService {
	public async generateKeyPair(): Promise<KeyPair> {
		const keyPair = generateKeyPairSync("rsa", {
			modulusLength: 4096,
			publicKeyEncoding: {
				type: "spki",
				format: "pem",
			},
			privateKeyEncoding: {
				type: "pkcs8",
				format: "pem",
			},
		});

		const privateKey = createPrivateKey(keyPair.privateKey);
		const publicKey = createPublicKey(keyPair.publicKey);

		return { privateKey, publicKey };
	}

	public async sign(privateKey: KeyObject, content: string): Promise<string> {
		const sign = createSign("RSA-SHA256");
		sign.write(content);
		sign.end();
		return sign.sign(privateKey, "base64");
	}
}

export default RsaCryptor;
