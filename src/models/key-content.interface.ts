export interface KeyContent {
	commonName: string;
	content: string;
	algorithm: "rsa" | "ecc";
	date: string;
}

export interface NewKeyContent extends Omit<KeyContent, "date"> {}
