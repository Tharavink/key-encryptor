import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NewKeyContent } from "./key-content.interface";
import config from "../config";

class KeyContentModel {
	private tableName = config.aws.dynamodb.tableName;
	private client: DynamoDBClient;

	constructor() {
		this.client = new DynamoDBClient({
			region: config.aws.region,
			endpoint: config.aws.endpoint,
		});
	}

	public async save(keyContent: NewKeyContent): Promise<void> {
		const dateString = new Date().toISOString();
		const command = new PutItemCommand({
			Item: {
				commonName: { S: keyContent.commonName },
				createdAt: { S: dateString },
				algorithm: { S: keyContent.algorithm },
				content: { S: keyContent.content },
			},
			TableName: this.tableName,
		});

		try {
			await this.client.send(command);
		} catch (error) {
			throw error;
		}
	}
}

export default KeyContentModel;
