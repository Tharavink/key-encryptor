export interface StorageService {
	getFile(key: string): Promise<Buffer>;
}
