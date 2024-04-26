import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StorageService } from "../storage.interface";
import config from "../../../config";

class S3StorageService implements StorageService {
	private s3Client: S3Client;

	constructor() {
		this.s3Client = new S3Client({
			region: config.aws.region,
			forcePathStyle: true,
			endpoint: config.aws.s3.endpoint,
		});
	}

	public async getFile(key: string): Promise<Buffer> {
		try {
			const command = new GetObjectCommand({
				Bucket: config.aws.s3.bucketName,
				Key: key,
			});

			const response = await this.s3Client.send(command);
			const dataString = await response.Body?.transformToString();
			if (!dataString) {
				throw new Error("Unable to read file");
			}
			return Buffer.from(dataString);
		} catch (error) {
			throw error;
		}
	}
}

export default S3StorageService;
