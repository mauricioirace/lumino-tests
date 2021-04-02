import Lumino from 'lumino-js-sdk';

export default class SetupLoader {
    constructor(setup) {
        this.loadNodes(setup);
        this.openChannels(setup);
    }

    loadNodes(setup) {
        let nodeNames = [];
        if (Array.isArray(setup.nodes)) {
            nodeNames = setup.nodes
        } else {
            for (let i = 0; i < setup.nodes; i++) {
                nodeNames.push(`node${i}`);
            }
        }
        return this.setupNodes(nodeNames);
    }

    setupNodes(nodeNames) {
        this.nodes = {}
        nodeNames.forEach(nodeName, i => {
            this.nodes[nodeName] = {
                sdk: this.buildSdk(i),
            }
        })
    }

    buildSdk(i) {
        return new Lumino({luminoNodeBaseUrl: `http://localhost:500${i + 1}`});
    }
    
    openChannels(setup) {
        this.nodes.papafrita.sdk;
    }


    getTokens() {
        return [
            "LUM",
            "RIF"
        ] 
    }
}