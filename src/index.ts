import SetupLoader, {SetupJson} from "./setup";
import {Node} from "container-manager";

export interface LuminoTesting {
    nodes: () => Node[];
    stop: () => void;
}

export default async function LuminoTesting(setupJson: SetupJson): Promise<LuminoTesting> {
    const setupLoader: SetupLoader = await SetupLoader.create(setupJson);
    return {
        nodes: setupLoader.getNodes,
        stop: setupLoader.stop
    };
}
