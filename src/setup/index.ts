import ContainerManager from "../container-manager";
import {getTokenAddress, validateTokens} from '../token/util';
import Web3 from 'web3';
import {LuminoNode, Node, NodeList} from "../types/node";
import {SetupJson, SetupNode, SetupToken} from "../types/setup";
import {LuminoTesting} from "../types/lumino-testing";

export default class SetupLoader {

    private nodes: NodeList = {};

    private constructor(private containerManager: ContainerManager) {}

    public static async initialize(setup: SetupJson): Promise<LuminoTesting> {
        const containerManager = await ContainerManager.create('regtest');
        const setupLoader: SetupLoader = new SetupLoader(containerManager);
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

    private openChannels(setup: SetupJson) {
        // TODO: this should be delegated to another module, i mean since this is a setup parser only
        //  the channel setup should be in another file using the parsed configuration from here,
        //  same thing we do with the nodes above.
        return Promise.all(setup.channels.map(async ({tokenSymbol, participant1, participant2}) => {
            const creator = this.nodes[participant1.node] as LuminoNode;
            const partner = this.nodes[participant2.node] as LuminoNode;
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

    public getNodes(): NodeList {
        return this.nodes;
    }

    public async stop(): Promise<void> {
        await this.containerManager.stopAll();
    }
}
