import Lumino from 'lumino-js-sdk';
import Web3 from 'web3';
import { getTokenAddress } from '../token/util';

export default class SetupLoader {
    constructor() {
    }

    static async fromSetup(setup) {
        const loader = new SetupLoader();
        await loader.loadNodes(setup);
        await loader.openChannels(setup);
        return loader;
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
        nodeNames.forEach((nodeName, i) => {
            this.nodes[nodeName] = {
                sdk: this.buildSdk(i),
            }
        })
    }

    buildSdk(i) {
        return new Lumino({luminoNodeBaseUrl: `http://localhost:500${i + 1}/api/v1`});
    }
    
    openChannels(setup) {
        return Promise.all(setup.channels.map(async ({token, participant1, participant2}) => {
            const creator = this.nodes[participant1.node];
            const partner = this.nodes[participant2.node];
            await creator.sdk.openChannel({
                tokenAddress: getTokenAddress(token),
                amountOnWei: Web3.utils.toWei(participant1.deposit.toString()),
                rskPartnerAddress: (await partner.sdk.getAddress()).our_address
              });
            if (participant2.deposit) {
                await partner.sdk.depositTokens({
                    tokenAddress: getTokenAddress(token),
                    amountOnWei: Web3.utils.toWei(participant2.deposit.toString()),
                    partnerAddress: (await creator.sdk.getAddress()).our_address
                  });
            }
        }));
    }


    getTokens() {
        return [
            "LUM",
            "RIF"
        ] 
    }



}