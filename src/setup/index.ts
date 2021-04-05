import ContainerManager, {Node} from "../container-manager";
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

    private constructor(private containerManager: ContainerManager) {}

    public static async create(setup: SetupJson): Promise<SetupLoader> {
        const containerManager = new ContainerManager();
        await containerManager.startupRsk();
        const setupLoader: SetupLoader = new SetupLoader(containerManager);
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

    private openChannels(setup) {
        // TODO: this should be delegated to another module, i mean since this is a setup parser only
        //  the channel setup should be in another file using the parsed configuration from here,
        //  same thing we do with the nodes above.
        return Promise.all(setup.channels.map(async ({tokenSymbol, participant1, participant2}) => {
            const creator = this.nodes[participant1.node];
            const partner = this.nodes[participant2.node];
            await creator.client.sdk.openChannel({
                tokenAddress: getTokenAddress(tokenSymbol),
                amountOnWei: Web3.utils.toWei(participant1.deposit.toString()),
                rskPartnerAddress: (await partner.client.sdk.getAddress()).our_address
              });
            if (participant2.deposit) {
                await partner.client.sdk.depositTokens({
                    tokenAddress: getTokenAddress(tokenSymbol),
                    amountOnWei: Web3.utils.toWei(participant2.deposit.toString()),
                    partnerAddress: (await creator.client.sdk.getAddress()).our_address
                  });
            }
        }));
    }

    public getNodes(): Node[] {
        return this.nodes;
    }

    public stop(): void {
        this.containerManager.stopAll();
    }
}
