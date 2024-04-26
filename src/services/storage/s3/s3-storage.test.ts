const GetObjectCommandMock = jest.fn();
const sendMock = jest.fn();

import config from "../../../config";
import S3StorageService from "./s3-storage";
import { StorageService } from "../storage.interface";

jest.mock("@aws-sdk/client-s3", () => ({
	S3Client: jest.fn(() => ({
		send: sendMock,
	})),
	GetObjectCommand: GetObjectCommandMock,
}));

describe("S3StorageService", () => {
	let s3StorageService: StorageService;

	beforeEach(() => {
		jest.clearAllMocks();
		s3StorageService = new S3StorageService();
	});

	describe("getFile", () => {
		it("should return file data as a Buffer", async () => {
			const mockContent = "File content";
			const mockKey = "example.txt";
			const mockBuffer = Buffer.from(mockContent);

			sendMock.mockReturnValueOnce({
				Body: {
					transformToString: () => mockContent,
				},
			});

			const fileData = await s3StorageService.getFile(mockKey);

			expect(GetObjectCommandMock).toHaveBeenCalledWith({
				Bucket: config.aws.s3.bucketName,
				Key: mockKey,
			});

			expect(fileData).toBeInstanceOf(Buffer);
			expect(fileData).toStrictEqual(mockBuffer);
		});

		it("should throw an error if unable to read file", async () => {
			const mockKey = "example.txt";

			sendMock.mockResolvedValueOnce({
				Body: null,
			});

			await expect(s3StorageService.getFile(mockKey)).rejects.toThrow(
				"Unable to read file"
			);
		});

		it("should throw an error if S3 getObject API fails", async () => {
			const mockKey = "example.txt";

			sendMock.mockRejectedValueOnce(new Error("Failed to fetch file"));

			await expect(s3StorageService.getFile(mockKey)).rejects.toThrow(
				"Failed to fetch file"
			);
		});
	});
});
