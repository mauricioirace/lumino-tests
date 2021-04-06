import ContainerManager from '../container-manager';
import {validateTokens} from '../token/util';
import {NodeList} from '../types/node';
import {SetupJson, SetupNode, SetupToken} from '../types/setup';
import {LuminoTestEnvironment} from "../types/lumino-test-environment";
import ChannelManager from '../channel-manager';

export default class EnvironmentLoader {

    private nodes: NodeList = {};

    private constructor(private containerManager: ContainerManager, private channelManager: ChannelManager) {}

    public static async load(setup: SetupJson): Promise<LuminoTestEnvironment> {
        const containerManager = await ContainerManager.create('regtest');
        const channelManager = new ChannelManager();
        const setupLoader = new EnvironmentLoader(containerManager, channelManager);
        await setupLoader.loadLuminoNodes(setup);
        await setupLoader.openChannels(setup);
        return new LuminoTestEnvironment(setupLoader);
    }

    private async loadLuminoNodes(setup: SetupJson): Promise<void> {
        let nodeConfigs: SetupNode[] = [];
        if (Array.isArray(setup.nodes)) {
            const tokens: SetupToken[] = setup.nodes.flatMap(node => node.tokens);
            validateTokens(tokens);
            nodeConfigs = setup.nodes;
        } else {
            validateTokens(setup.tokens);
            for (let i = 0; i < setup.nodes; i++) {
                nodeConfigs.push({
                    name: `node${i}`,
                    tokens: setup.tokens as SetupToken[]
                });
            }
        }
        this.nodes = {};
        for (let nodeConfig of nodeConfigs) {
            this.nodes[nodeConfig.name] = await this.containerManager.startupLuminoNode(nodeConfig);
        }
    }

    private async openChannels(setup: SetupJson) {
        return await this.channelManager.openChannels(setup.channels, this.nodes);
    }

    public getNodes(): NodeList {
        return this.nodes;
    }

    public async stop(): Promise<void> {
        await this.containerManager.stopAll();
    }
}
