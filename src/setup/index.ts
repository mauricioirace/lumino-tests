import ContainerManager, {Node} from "../container-manager";
import ChannelManager from 'channel-manager'
import { getTokenAddress } from 'token/util';
import Web3 from 'web3';

export interface SetupParticipant {
    node: string;
    deposit: number;
}

export interface SetupChannel {
    tokenSymbol: string;
    participant1: SetupParticipant;
    participant2: SetupParticipant;
}

export interface SetupToken {
    symbol: string;
    amount: number;
}

export interface SetupNode {
    name: string;
    tokens: SetupToken[];
}

export interface SetupJson {
    nodes: SetupNode[] | number;
    channels: SetupChannel[];
    tokens?: SetupToken[];
}

export const DEFAULT_TOKENS = [
    "LUM",
    "RIF"
];

export default class SetupLoader {

    private nodes: Node[];

    private constructor(private containerManager: ContainerManager, private channelManager: ChannelManager) {}

    public static async create(setup: SetupJson): Promise<SetupLoader> {
        const containerManager = new ContainerManager();
        await containerManager.startupRsk();
        const setupLoader: SetupLoader = new SetupLoader(containerManager, new ChannelManager());
        await setupLoader.loadNodes(setup);
        await setupLoader.openChannels(setup);
        return setupLoader;
    }

    private validateTokens(tokens?: SetupToken[]): void {
        if (tokens) {
            console.log('tokens', tokens);
            const notExistentTokens = tokens.filter(token => DEFAULT_TOKENS.indexOf(token.symbol) === -1);
            if (notExistentTokens.length > 0) {
                throw new Error(`You need to specify a valid token symbol on the tokens configuration. 
                                    Valid values are ${DEFAULT_TOKENS}. Error: invalid values ${notExistentTokens.map(token => token.symbol)}`);
            }
        }
    }

    private async loadNodes(setup: SetupJson): Promise<void> {
        let nodeConfigs: SetupNode[] = [];
        if (Array.isArray(setup.nodes)) {
            const tokens: SetupToken[] = setup.nodes.flatMap(node => node.tokens);
            this.validateTokens(tokens);
            nodeConfigs = setup.nodes;
        } else {
            this.validateTokens(setup.tokens);
            for (let i = 0; i < setup.nodes; i++) {
                nodeConfigs.push({
                    name: `node${i}`,
                    tokens: setup.tokens as SetupToken[]
                });
            }
        }
        await this.setupNodes(nodeConfigs);
    }

    private async setupNodes(nodeConfigs: SetupNode[]): Promise<void> {
        this.nodes = [];
        for (let nodeConfig of nodeConfigs) {
            this.nodes[nodeConfig.name] = await this.containerManager.startupLuminoNode(nodeConfig);
        }
    }

    private async openChannels(setup) {
        return await this.channelManager.openChannels(setup.channels, this.nodes);
    }

    public getNodes(): Node[] {
        return this.nodes;
    }

    public stop(): void {
        this.containerManager.stopAll();
    }
}
