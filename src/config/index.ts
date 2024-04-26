interface EnvType {
	AWS_ENDPOINT: string | undefined;
	AWS_REGION: string | undefined;
	S3_ENDPOINT: string | undefined;
	S3_BUCKET_NAME: string | undefined;
	DYNAMODB_TABLE_NAME: string | undefined;
}

interface ConfigType {
	aws: {
		endpoint: string;
		region: string;
		s3: {
			endpoint: string;
			bucketName: string;
		};
		dynamodb: {
			tableName: string;
		};
	};
}

type WithoutNullableKeys<Type> = {
	[Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

const getEnvKeys = (): EnvType => {
	return {
		AWS_ENDPOINT: process.env.AWS_ENDPOINT,
		AWS_REGION: process.env.AWS_REGION,
		S3_ENDPOINT: process.env.S3_ENDPOINT,
		S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
	};
};

const getConfigFromEnv = (keys: WithoutNullableKeys<EnvType>): ConfigType => {
	return {
		aws: {
			endpoint: keys.AWS_ENDPOINT,
			region: keys.AWS_REGION,
			s3: {
				endpoint: keys.S3_ENDPOINT,
				bucketName: keys.S3_BUCKET_NAME,
			},
			dynamodb: {
				tableName: keys.DYNAMODB_TABLE_NAME,
			},
		},
	};
};

const buildConfig = (): ConfigType => {
	const envKeys = getEnvKeys();

	for (const [key, value] of Object.entries(envKeys)) {
		if (value === undefined) {
			throw new Error(`Missing key ${key} in env.yml`);
		}
	}

	return getConfigFromEnv(envKeys as WithoutNullableKeys<EnvType>);
};

const config = buildConfig();

export default config;
