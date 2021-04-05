export default class ContainerManager {
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
    }
    stopAll() {
        this.luminoNodes.forEach(node => node.stop());
        this.explorers.forEach(node => node.stop());
        this.notifiers.forEach(node => node.stop());
        this.rskNodes.forEach(node => node.stop());
    }
}
