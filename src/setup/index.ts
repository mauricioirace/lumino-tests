import ContainerManager from "../container-manager";
import { getTokenAddress } from 'token/util';
import Web3 from 'web3';

const DEFAULT_TOKENS = [
    "LUM",
    "RIF"
];

export default class SetupLoader {

    private containerManager: ContainerManager;
    private nodes: any;

    async constructor(setup) {
        this.containerManager = new ContainerManager();
        await this.containerManager.startupRsk();
        await this.loadNodes(setup);
        await this.openChannels(setup);
    }

    validateTokens(tokens) {
        if (tokens) {
            console.log('tokens', tokens);
            const notExistentTokens = tokens.filter(token => DEFAULT_TOKENS.indexOf(token.symbol) === -1);
            if (notExistentTokens.length > 0) {
                throw new Error(`You need to specify a valid token symbol on the tokens configuration. 
                                    Valid values are ${DEFAULT_TOKENS}. Error: invalid values ${notExistentTokens.map(token => token.symbol)}`);
            }
        }
    }

    loadNodes(setup) {
        let nodeConfigs = [];
        if (Array.isArray(setup.nodes)) {
            const tokens = setup.nodes.flatMap(node => node.tokens);
            this.validateTokens(tokens);
            nodeConfigs = setup.nodes;
        } else {
            this.validateTokens(setup.tokens);
            for (let i = 0; i < setup.nodes; i++) {
                nodeConfigs.push({
                    name: `node${i}`,
                    tokens: setup.tokens
                });
            }
        }
        return this.setupNodes(nodeConfigs);
    }

    setupNodes(nodeConfigs) {
        this.nodes = {};
        nodeConfigs.forEach(nodeConfig => {
            this.nodes[nodeConfig.name] = this.containerManager.startupLuminoNode(nodeConfig);
        });
    }

    openChannels(setup) {
        // TODO: this should be delegated to another module, i mean since this is a setup parser only
        //  the channel setup should be in another file using the parsed configuration from here,
        //  same thing we do with the nodes above.
        return Promise.all(setup.channels.map(async ({tokenSymbol, participant1, participant2}) => {
            const creator = this.nodes[participant1.node];
            const partner = this.nodes[participant2.node];
            await creator.sdk.openChannel({
                tokenAddress: getTokenAddress(tokenSymbol),
                amountOnWei: Web3.utils.toWei(participant1.deposit.toString()),
                rskPartnerAddress: (await partner.sdk.getAddress()).our_address
              });
            if (participant2.deposit) {
                await partner.sdk.depositTokens({
                    tokenAddress: getTokenAddress(tokenSymbol),
                    amountOnWei: Web3.utils.toWei(participant2.deposit.toString()),
                    partnerAddress: (await creator.sdk.getAddress()).our_address
                  });
            }
        }));
    }

    getTokens() {
        return DEFAULT_TOKENS;
    }

    getNodes() {
        return this.nodes;
    }

    stop() {
        this.containerManager.stopAll();
    }
}
