import { KeyObject, X509Certificate } from "crypto";

class X509CertificateService {
	private cert: X509Certificate;

	constructor(cert: Buffer) {
		this.cert = new X509Certificate(cert);
	}

	public getPublicKey(): KeyObject {
		return this.cert.publicKey;
	}

	public getCommonName(): string {
		const regex = /(?<=CN=).*(?=\n)/;
		const match = regex.exec(this.cert.subject);
		if (!match?.[0]) {
			throw new Error("Common name not found");
		}
		return match?.[0];
	}
}

export default X509CertificateService;
