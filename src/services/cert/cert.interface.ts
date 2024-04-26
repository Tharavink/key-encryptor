import { KeyObject } from "crypto";

export interface CertService {
	getPublicKey(): KeyObject;
	getCommonName(): string;
}
