import SetupLoader from "./setup";
import {LuminoTesting} from "./types/lumino-testing";
import {SetupJson} from "./types/setup";

export default async function LuminoTesting(setupJson: SetupJson): Promise<LuminoTesting> {
   return SetupLoader.initialize(setupJson);
}
