import LuminoClient from "lumino-client";
import {SetupChannel} from "setup";
import { Node } from 'container-manager';
import { getTokenAddress, toWei } from "token/util";

export interface Channel {
    client?: LuminoClient;
    container: Node;
}

export default class ChannelManager {

    constructor() {
    }

    async openChannels(channels: SetupChannel[], nodes: NodeList): Promise<void> {
        await Promise.all(channels.map((channel) => this.openChannel(channel, nodes)));
    }
    async openChannel({ tokenSymbol, participant1, participant2 }: SetupChannel, nodes: NodeList): Promise<void> {
        const tokenAddress = getTokenAddress(tokenSymbol);
        const creator = nodes[participant1.node];
        const partner = nodes[participant2.node];
        await creator.client.sdk.openChannel({
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
