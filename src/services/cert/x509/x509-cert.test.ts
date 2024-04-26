import {
	CertData,
	generateInvalidCert,
	generateValidCert,
} from "../../../test/fixtures";
import X509CertificateService from "./x509-cert";

describe("X509CertificateService", () => {
	let validCertData: CertData;
	let invalidCertData: CertData;

	beforeAll(async () => {
		validCertData = await generateValidCert();
		invalidCertData = await generateInvalidCert();
	});

	describe("getPublicKey", () => {
		it("should return the valid public key", async () => {
			const x509Service = new X509CertificateService(
				validCertData.certificate
			);
			const publicKey = x509Service.getPublicKey();
			expect(publicKey).toStrictEqual(validCertData.publicKey);
		});
	});

	describe("getCommonName", () => {
		it("should return the valid common name", async () => {
			const x509Service = new X509CertificateService(
				validCertData.certificate
			);
			const commonName = x509Service.getCommonName();
			expect(commonName).toStrictEqual(validCertData.commonName);
		});

		it("should throw an error if common name is not found", async () => {
			const x509Service = new X509CertificateService(
				invalidCertData.certificate
			);
			expect(() => x509Service.getCommonName()).toThrow(
				"Common name not found"
			);
		});
	});
});
