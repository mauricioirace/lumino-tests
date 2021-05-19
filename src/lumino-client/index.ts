import Lumino, { BalanceIdentifier, ChannelIdentifier, OpenChannelRequest } from 'lumino-js-sdk';

export default class LuminoClient {

    private constructor(
        public sdk: Lumino,
        public address: string,
        public tokens: any[]) {}

    public static async create(luminoNodeBaseUrl: string): Promise<LuminoClient> {
        const sdk = new Lumino(luminoNodeBaseUrl);
        const address = await sdk.getAddress();
        const tokens = await sdk.getTokens();
        return new LuminoClient(sdk, address.our_address, tokens);
    }

    /**
     * Get channels
     *
     * @param tokenAddress {String} : an optional tokenAddress to filter by.
     *
     * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
    getChannels(tokenAddress?: string): Promise<any> {
        return this.sdk.getChannels(tokenAddress);
    }

    /**
     * Get channel
     *
     * @param tokenAddress {String} : the mandatory channel token_address.
     * @param partnerAddress {String} : the mandatory channel partner_address.
     *
     * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
     getChannel(identifier: ChannelIdentifier): Promise<any> {
         return this.sdk.getChannel(identifier);
     }
      /**
     * Open a new channel between two nodes. Allow open a new channel by rsk address node or
     * rns address node.
     *
     * @param params - This is mandatory
     *  - rskPartnerAddress - for example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
     *  - rnsPartnerAddress - for example: dev.rsk.co
     *  - tokenAddress - for example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
     *  - amountOnWei - for example: 1, should be on wei
     *
     *  The params rnsPartnerAddress and rnsPartnerAddress never go together
     *
     * @returns {Promise} new channel info, or and error information
     */
    openChannel(request: OpenChannelRequest): Promise<any> {
        return this.openChannel(request);
    }

    /**
     * Close an exist channel.
     *
     * @param partnerAddress {String} - For example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
     * @param tokenAddress {String} - For example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
     * @returns {Promise} close channel response, or error response.
     */
    closeChannel(identifier: ChannelIdentifier): Promise<any> {
        return this.closeChannel(identifier);
    }

    /**
     * Make off chain payment in a channel.
     *
     * @param amountOnWei {number} - Mandatory, the amount has to be on wei
     * @param tokenAddress {String} - Mandatory
     * @param partnerAddress {String} - Mandatory
     *
     * @returns {Promise}
     */
    makePayment(payment: BalanceIdentifier): Promise<any> {
        return this.sdk.makePayment(payment);
    }

    /**
     * Deposit tokens into a channel
     *
     * @param amountOnWei {number} - Mandatory should be on wei
     * @param tokenAddress {String} - Mandatory
     * @param partnerAddress {String} - Mandatory
     *
     * @returns {Promise} deposit result or error
     */
    depositTokens(deposit: BalanceIdentifier): Promise<any> {
        return this.sdk.depositTokens(deposit)
    }

    async getChannelBalance(identifier: ChannelIdentifier): Promise<number>{
        const channel = await this.getChannel(identifier);
        return channel.balance;
    }
    async getChannelState(identifier: ChannelIdentifier): Promise<string>{
        const channel = await this.getChannel(identifier);
        return channel.state;
    }
}

