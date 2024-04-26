import { KeyObject } from "crypto";

export interface KeyPair {
	privateKey: KeyObject;
	publicKey: KeyObject;
}

export interface CryptorService {
	generateKeyPair(): Promise<KeyPair>;
	sign(privateKey: KeyObject, content: string): Promise<string>;
}
