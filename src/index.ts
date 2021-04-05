import SetupLoader from "./setup";
import {LuminoTesting} from "types/lumino-testing";
import {SetupJson} from "types/setup";

export default async function LuminoTesting(setupJson: SetupJson): Promise<LuminoTesting> {
   return await SetupLoader.initialize(setupJson);
}
