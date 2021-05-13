import EnvironmentLoader from "./environment-loader";
import { LuminoTestEnvironment } from "./types/lumino-test-environment";
import { SetupJson } from "./types/setup";

export default async function setupTestEnvironment(
  setupJson: SetupJson
): Promise<LuminoTestEnvironment> {
  return EnvironmentLoader.load(setupJson);
}
