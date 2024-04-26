import KeyContentModel from "./src/models/key-content";
import CertFactory from "./src/services/cert/cert-factory";
import CryptorFactory from "./src/services/cryptor/crypto-factory";
import StorageServiceFactory from "./src/services/storage/storage-factory";

interface Event {
	"s3-key": string;
}

module.exports.generateKey = async (event: Event) => {
	try {
		const storage = StorageServiceFactory.getStorageService();
		const certBuffer = await storage.getFile(event["s3-key"]);

		const cert = CertFactory.getCertService(certBuffer);
		const commonName = cert.getCommonName();
		const publicKey = cert.getPublicKey();

		let publicKeyContent = publicKey.export({
			type: "spki",
			format: "pem",
		});
		if (Buffer.isBuffer(publicKeyContent)) {
			publicKeyContent = publicKeyContent.toString("utf-8");
		}

		const rsaCryptor = CryptorFactory.getCryptorService();
		const { privateKey } = await rsaCryptor.generateKeyPair();
		const rsaContent = await rsaCryptor.sign(privateKey, publicKeyContent);

		const keyContentModel = new KeyContentModel();
		await keyContentModel.save({
			commonName,
			content: rsaContent,
			algorithm: "rsa",
		});

		const eccCryptor = CryptorFactory.getCryptorService("ecc");
		const { privateKey: eccPrivateKey } =
			await eccCryptor.generateKeyPair();
		const eccContent = await eccCryptor.sign(
			eccPrivateKey,
			publicKeyContent
		);

		await keyContentModel.save({
			commonName,
			content: eccContent,
			algorithm: "ecc",
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Successfully signed and stored the certificate!",
				input: event,
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Failed to sign and store the certificate!",
				error: error,
			}),
		};
	}
};
