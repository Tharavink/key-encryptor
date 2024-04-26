import { KeyObject, createPublicKey } from "crypto";
import * as fs from "fs";

export interface CertData {
	commonName: string | undefined;
	certificate: Buffer;
	publicKey: KeyObject;
}

const generateCertificate = async (
	includeCommonName = true
): Promise<CertData> => {
	try {
		let publicKeyPath;
		let certPath;
		let commonName: string | undefined = undefined;
		if (includeCommonName) {
			publicKeyPath = "./src/test/valid-cert/public-key.pem";
			certPath = "./src/test/valid-cert/certificate.pem";
			commonName = "somecompany.com";
		} else {
			publicKeyPath = "./src/test/invalid-cert/public-key.pem";
			certPath = "./src/test/invalid-cert/certificate.pem";
		}

		const certificate = fs.readFileSync(certPath);

		const publicKeyContent = fs.readFileSync(publicKeyPath);
		const publicKey = createPublicKey(publicKeyContent);

		return { commonName, certificate, publicKey };
	} catch (error) {
		console.error("Error generating certificates:", error);
		throw error;
	}
};

export const generateValidCert = async (): Promise<CertData> => {
	try {
		return await generateCertificate();
	} catch (error) {
		console.error("Error generating certificate:", error);
		throw error;
	}
};

export const generateInvalidCert = async (): Promise<CertData> => {
	try {
		return await generateCertificate(false);
	} catch (error) {
		console.error("Error generating certificate:", error);
		throw error;
	}
};
