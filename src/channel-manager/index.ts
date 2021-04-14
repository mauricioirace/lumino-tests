import LuminoClient from "../lumino-client";
import {SetupChannel} from "../types/setup";
import {Node, LuminoNode, NodeList} from "../types/node";
import { getTokenAddress, toWei } from "../util/token";

export default class ChannelManager {

    constructor() {
    }

    async openChannels(channels: SetupChannel[], nodes: NodeList): Promise<void> {
        console.debug('Opening channels')
        await Promise.all(channels.map((channel) => this.openChannel(channel, nodes)));
        console.debug('All requested channels have been opened')
    }
    async openChannel({ tokenSymbol, participant1, participant2 }: SetupChannel, nodes: NodeList): Promise<void> {
        const tokenAddress = getTokenAddress(tokenSymbol);
        const creator = nodes[participant1.node] as LuminoNode;
        const partner = nodes[participant2.node] as LuminoNode;
        console.debug(`opening channel between ${creator.client.address} and ${partner.client.address} with token ${tokenAddress}`)
        await creator.client?.sdk.openChannel({
            tokenAddress: tokenAddress,
            amountOnWei: toWei(participant1.deposit),
            rskPartnerAddress: partner.client.address
          });
        if (participant2.deposit) {
              await partner.client?.sdk.depositTokens({
                  tokenAddress: getTokenAddress(tokenSymbol),
                  amountOnWei: toWei(participant2.deposit),
                  partnerAddress: creator.client.address
                });
          }
    }
}