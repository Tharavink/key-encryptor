import S3StorageService from "./s3/s3-storage";
import { StorageService } from "./storage.interface";

class StorageServiceFactory {
	public static getStorageService(): StorageService {
		return new S3StorageService();
	}
}

export default StorageServiceFactory;
