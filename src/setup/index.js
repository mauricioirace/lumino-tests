import ContainerManager from "./containers";

const DEFAULT_TOKENS = [
    "LUM",
    "RIF"
];

export default class SetupLoader {
    constructor(setup) {
        this.containerManager = new ContainerManager();
        this.containerManager.startupRsk();
        this.loadNodes(setup);
        this.openChannels(setup);
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
        console.log('Open Channels');
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
