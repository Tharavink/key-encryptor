import { CryptorService } from "./cryptor.interface";
import EccCryptor from "./ecc/ecc-cryptor";
import RsaCryptor from "./rsa/rsa-cryptor";

class CryptorFactory {
	public static getCryptorService(
		algorithm: "rsa" | "ecc" = "rsa"
	): CryptorService {
		if (algorithm === "rsa") {
			return new RsaCryptor();
		}

		if (algorithm === "ecc") {
			return new EccCryptor();
		}

		throw new Error("Unknown algorithm. Please provide 'rsa' or 'ecc'");
	}
}

export default CryptorFactory;
