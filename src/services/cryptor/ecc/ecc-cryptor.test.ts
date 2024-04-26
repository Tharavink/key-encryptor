const mockPrivateKey = "mockPrivateKey";
const mockPublicKey = "mockPublicKey";
const mockSignature = "mockSignature";

const generateKeyPairSyncMock = jest.fn().mockReturnValue({
	privateKey: mockPrivateKey,
	publicKey: mockPublicKey,
});

const createPrivateKeyMock = jest
	.fn()
	.mockReturnValue(`private-key-${mockPrivateKey}`);
const createPublicKeyMock = jest
	.fn()
	.mockReturnValue(`public-key-${mockPublicKey}`);

const signMock = jest.fn().mockReturnValue(mockSignature);
const writeMock = jest.fn();
const createSignMock = jest.fn().mockReturnValue({
	write: writeMock,
	end: jest.fn(),
	sign: signMock,
});

const KeyObjectMock = jest.fn().mockImplementation(() => ({
	key: "key",
}));

import EccCryptor from "./ecc-cryptor";

jest.mock("crypto", () => ({
	generateKeyPairSync: generateKeyPairSyncMock,
	createPrivateKey: createPrivateKeyMock,
	createPublicKey: createPublicKeyMock,
	createSign: createSignMock,
	KeyObject: KeyObjectMock,
}));

describe("EccCryptor", () => {
	describe("generateKeyPair", () => {
		it("should generate a key pair", async () => {
			const eccCryptor = new EccCryptor();
			const keyPair = await eccCryptor.generateKeyPair();

			expect(generateKeyPairSyncMock).toHaveBeenCalledWith("ec", {
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

			expect(keyPair.privateKey).toEqual(`private-key-${mockPrivateKey}`);
			expect(keyPair.publicKey).toEqual(`public-key-${mockPublicKey}`);
		});
	});

	describe("sign", () => {
		it("should sign the content using the private key", async () => {
			const mockContent = "Hello, World!";
			const privateKey = new KeyObjectMock();

			const eccCryptor = new EccCryptor();
			const signature = await eccCryptor.sign(privateKey, mockContent);

			expect(createSignMock).toHaveBeenCalledWith("SHA256");
			expect(writeMock).toHaveBeenCalledWith(mockContent);
			expect(signMock).toHaveBeenCalledWith(privateKey, "base64");
			expect(signature).toEqual(mockSignature);
		});
	});
});
