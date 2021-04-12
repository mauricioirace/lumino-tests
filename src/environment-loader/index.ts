import ContainerManager from '../container-manager';
import {validateTokens} from '../util/token';
import {NodeList} from '../types/node';
import {SetupJson, SetupNode, SetupToken} from '../types/setup';
import {LuminoTestEnvironment} from "../types/lumino-test-environment";
import ChannelManager from '../channel-manager';

export default class EnvironmentLoader {

    private containerManager: ContainerManager = ContainerManager.create();
    private channelManager: ChannelManager = new ChannelManager();
    private nodes: NodeList = {};

    private constructor() {}

    public static async load(setup: SetupJson): Promise<LuminoTestEnvironment> {
        const environmentLoader = new EnvironmentLoader();
        await environmentLoader.parseAndLoad(setup);
        return new LuminoTestEnvironment(environmentLoader);
    }

    private async parseAndLoad(setup: SetupJson): Promise<void> {
        await this.containerManager.startRskNode();
        if (setup.notifiers) {
            for (let notifier = 0; notifier < setup.notifiers; notifier++) {
                await this.containerManager.startNotifier(notifier);
            }
        }
        if (setup.enableExplorer) {
            await this.containerManager.startExplorer();
        }
        await this.loadLuminoNodes(setup);
        // await setupLoader.openChannels(setup);
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
                    tokens: setup.tokens as SetupToken[],
                    enableHub: setup.enableHub
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
