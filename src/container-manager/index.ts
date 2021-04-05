import LuminoClient from "lumino-client";
import {SetupNode} from "setup";

export interface NodeContainer {
    start(config: any): void;
    stop(): void;
}

export interface Node {
    client?: LuminoClient;
    container: NodeContainer;
}

export default class ContainerManager {

    private rskNodes: Node[];
    private notifiers: Node[];
    private explorers: Node[];
    private luminoNodes: Node[];

    constructor() {
        this.rskNodes = [];
        this.notifiers = [];
        this.explorers = [];
        this.luminoNodes = [];
    }

    async startupRsk(): Promise<Node> {
        console.log('Setup RSK');
        return;
    }

    async startupNotifiers(amount): Promise<Node> {
        console.log('Setup Notifiers');
        return;
    }

    async startupExplorer(): Promise<Node> {
        console.log('Setup Explorer');
        return;
    }

    async startupLuminoNode(nodeConfig: SetupNode): Promise<Node> {
        console.log('Setup Lumino', nodeConfig);
        return {
            container: {
                start: config => {},
                stop: () => {}
            },
            client: await LuminoClient.create(`http://localhost:500${i++}/api/v1`)
        };
    }

    stopAll(): void {
        this.luminoNodes.forEach(node => node.container.stop());
        this.explorers.forEach(node => node.container.stop());
        this.notifiers.forEach(node => node.container.stop());
        this.rskNodes.forEach(node => node.container.stop());
    }
}
