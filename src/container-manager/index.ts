import {SetupJson, SetupNode} from "../types/setup";
import DockerManager from "../container-manager/docker-manager";
import {LuminoNode, Node} from "../types/node";

export default class ContainerManager {

    private rskNode: Node;
    private explorer: Node;
    private notifiers: Node[];
    private luminoNodes: LuminoNode[];

    private constructor(private dockerManager: DockerManager) {
        this.rskNode = {
            container: dockerManager.getContainer('rsk-node')
        };
        this.explorer = {
            container: dockerManager.getContainer('lumino-explorer')
        };
        this.notifiers = [];
        this.luminoNodes = [];
    }

    public static async create(setup: SetupJson): Promise<ContainerManager> {
        return new ContainerManager(await DockerManager.create(setup));
    }

    public async startupLuminoNode(nodeConfig: SetupNode): Promise<LuminoNode> {
        console.log('Setup Lumino', nodeConfig);
        //TODO: pending add dockerfile to testcontainers
        return Promise.resolve({
            client: undefined,
            container: undefined
        } as any);
    }

    public async stopAll(): Promise<void> {
        for (const node of this.luminoNodes) {
            await node.container.stop();
        }
        await this.dockerManager.destroy();
    }
}
