import ContainerManager from "../container-manager";
import {getTokenAddress, validateTokens} from '../token/util';
import Web3 from 'web3';
import {LuminoNode, Node, NodeList} from "../types/node";
import {SetupJson, SetupNode, SetupToken} from "../types/setup";
import {LuminoTesting} from "../types/lumino-testing";
import ChannelManager from "../channel-manager";

export default class SetupLoader {

    private nodes: NodeList = {};

    private constructor(private containerManager: ContainerManager, private channelManager: ChannelManager) {}

    public static async initialize(setup: SetupJson): Promise<LuminoTesting> {
        const containerManager = await ContainerManager.create('regtest');
        const channelManager = new ChannelManager();
        const setupLoader: SetupLoader = new SetupLoader(containerManager, channelManager);
        await setupLoader.loadLuminoNodes(setup);
        await setupLoader.openChannels(setup);
        return {
            nodes: setupLoader.getNodes,
            stop: setupLoader.stop
        };
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
