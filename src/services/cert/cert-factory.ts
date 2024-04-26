import { CertService } from "./cert.interface";
import X509CertificateService from "./x509/x509-cert";

class CertFactory {
	public static getCertService(cert: Buffer): CertService {
		return new X509CertificateService(cert);
	}
}

export default CertFactory;
