import { SetupChannel } from '../types/setup';
import { LuminoNodeList } from '../types/node';
import { tokenAddresses, toWei } from '../util/token';

export default class ChannelManager {
    constructor() {}

    async openChannels(
        channels: SetupChannel[],
        nodes: LuminoNodeList
    ): Promise<void> {
        console.debug('Opening channels');
        await Promise.all(
            channels.map((channel) => this.openChannel(channel, nodes))
        );
        console.debug('All requested channels have been opened');
    }
    async openChannel(
        { tokenSymbol, participant1, participant2 }: SetupChannel,
        nodes: LuminoNodeList
    ): Promise<void> {
        const tokenAddress = tokenAddresses[tokenSymbol];
        const creator = nodes[participant1.node];
        const partner = nodes[participant2.node];
        console.debug(
            `opening channel between ${creator.client.address} and ${partner.client.address} with token ${tokenAddress}`
        );
        await creator.client?.sdk.openChannel({
            tokenAddress,
            amountOnWei: toWei(participant1.deposit),
            rskPartnerAddress: partner.client.address
        });
        if (participant2.deposit) {
            await partner.client?.sdk.depositTokens({
                tokenAddress,
                amountOnWei: toWei(participant2.deposit),
                partnerAddress: creator.client.address
            });
        }
    }
}
