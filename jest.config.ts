import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	verbose: true,
	setupFilesAfterEnv: ["dotenv/config"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
};

export default config;
