import SetupLoader from "./setup";

export default class LuminoTesting {
    static initialize(setupJson) {
        const setupLoader = new SetupLoader(setupJson);
        return {
            nodes: setupLoader.getNodes,
            stop: setupLoader.stop
        };
    }
}
