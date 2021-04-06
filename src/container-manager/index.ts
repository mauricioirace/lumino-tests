import {SetupNode} from "../types/setup";
import DockerManager from "../container-manager/docker-manager";
import {ChainName} from '../types/chain-name';
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

    public static async create(chainName: ChainName): Promise<ContainerManager> {
        const dockerManager = await DockerManager.create(chainName);
        return new ContainerManager(dockerManager);
    }

    public async startupLuminoNode(nodeConfig: SetupNode): Promise<LuminoNode> {
        console.log('Setup Lumino', nodeConfig);
        //TODO: pending add dockerfile to testcontainers
        throw new Error("NOT_IMPLEMENTED");
    }

    public async stopAll(): Promise<void> {
        for (const node of this.luminoNodes) {
            await node.container.stop();
        }
        await this.dockerManager.destroy();
    }
}
