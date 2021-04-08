import ContainerManager from '../container-manager';
import {validateTokens} from '../token/util';
import {NodeList} from '../types/node';
import {SetupJson, SetupNode, SetupToken} from '../types/setup';
import {LuminoTestEnvironment} from "../types/lumino-test-environment";

export default class EnvironmentLoader {

    private containerManager: ContainerManager = ContainerManager.create();
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

    // private openChannels(setup: SetupJson) {
    //     // TODO: this should be delegated to another module, i mean since this is a setup parser only
    //     //  the channel setup should be in another file using the parsed configuration from here,
    //     //  same thing we do with the nodes above.
    //     return Promise.all(setup.channels.map(async ({tokenSymbol, participant1, participant2}) => {
    //         const creator = this.nodes[participant1.node] as LuminoNode;
    //         const partner = this.nodes[participant2.node] as LuminoNode;
    //         await creator.client.sdk.openChannel({
    //             tokenAddress: getTokenAddress(tokenSymbol),
    //             amountOnWei: Web3.utils.toWei(participant1.deposit.toString()),
    //             rskPartnerAddress: (await partner.client.sdk.getAddress()).our_address
    //           });
    //         if (participant2.deposit) {
    //             await partner.client.sdk.depositTokens({
    //                 tokenAddress: getTokenAddress(tokenSymbol),
    //                 amountOnWei: Web3.utils.toWei(participant2.deposit.toString()),
    //                 partnerAddress: (await creator.client.sdk.getAddress()).our_address
    //               });
    //         }
    //     }));
    // }

    public getNodes(): NodeList {
        return this.nodes;
    }

    public async stop(): Promise<void> {
        await this.containerManager.stopAll();
    }
}
