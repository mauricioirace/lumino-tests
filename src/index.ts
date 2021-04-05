import SetupLoader from "./setup";

export default async function LuminoTesting(setupJson: any) {
    const setupLoader = await new SetupLoader(setupJson);
    return {
        nodes: setupLoader.getNodes,
        stop: setupLoader.stop
    };
}
