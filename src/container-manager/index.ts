import Lumino from 'lumino-js-sdk';

export default class ContainerManager {

    private rskNodes: any[];
    private notifiers: any[];
    private explorers: any[];
    private luminoNodes: any[];

    constructor() {
        this.rskNodes = [];
        this.notifiers = [];
        this.explorers = [];
        this.luminoNodes = [];
    }
    startupRsk() {
        console.log('Setup RSK');
    }
    startupNotifiers(amount) {
        console.log('Setup Notifiers');
    }
    startupExplorer() {
        console.log('Setup Explorer');
    }
    startupLuminoNode(nodeConfig) {
        console.log('Setup Lumino', nodeConfig);
        return {
            sdk: new Lumino({luminoNodeBaseUrl: `http://localhost:500${i++}/api/v1`})
        }
    }
    stopAll() {
        this.luminoNodes.forEach(node => node.stop());
        this.explorers.forEach(node => node.stop());
        this.notifiers.forEach(node => node.stop());
        this.rskNodes.forEach(node => node.stop());
    }
}
