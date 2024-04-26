import {
	KeyObject,
	createPrivateKey,
	createPublicKey,
	createSign,
	generateKeyPairSync,
} from "crypto";
import { CryptorService, KeyPair } from "../cryptor.interface";

class EccCryptor implements CryptorService {
	public async generateKeyPair(): Promise<KeyPair> {
		const keyPair = generateKeyPairSync("ec", {
			namedCurve: "sect239k1",
			publicKeyEncoding: {
				type: "spki",
				format: "pem",
			},
			privateKeyEncoding: {
				type: "sec1",
				format: "pem",
			},
		});

		const privateKey = createPrivateKey(keyPair.privateKey);
		const publicKey = createPublicKey(keyPair.publicKey);

		return { privateKey, publicKey };
	}

	public async sign(privateKey: KeyObject, content: string): Promise<string> {
		const sign = createSign("SHA256");
		sign.write(content);
		sign.end();
		return sign.sign(privateKey, "base64");
	}
}

export default EccCryptor;
