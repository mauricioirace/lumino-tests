declare module 'lumino-js-sdk' {
    export interface ChannelIdentifier { tokenAddress: string, partnerAddress: string }
    export interface OpenChannelRequest { tokenAddress: string, amountOnWei: number, rskPartnerAddress?: string, rnsPartnerAddress?: string }
    export interface BalanceIdentifier { tokenAddress: string, amountOnWei: number, partnerAddress: string }

/**
 * @classdesc Represents the Lumino SDK. It allows the user to make every call to the API with a single function.
 * @class
 */
export default class Lumino {
    /**
     * Create Lumino SDK.
     * @constructor
     * @param {String} luminoNodeBaseUrl - The base URL to invoke the api of node.
     */
    constructor(luminoNodeBaseUrl: string);

    /**
     * Get payments with combination of parameters.
     *
     * @param params - Are not mandatory. Exists a set of parameter what you can use to get payments.
     * This params are:
     *  - limit: to limit de quantity of payments
     *  - offset: to navigate between pages
     *  - initiator_address: to get payments with event EventPaymentSentSuccess, for the current node.
     *  - target_address: to get payments with target is equal to target_address param and the result can include,
     *    events how Sent, Received, Failed or Pending.
     *  - token_network_identifier: if you can obtain a set of payments in specific token_network
     *  - event_type: You can get 3 different types of events. This events correspond the following names;
     *    EventPaymentReceivedSuccess, EventPaymentSentFailed, EventPaymentSentSuccess. This names corresponding
     *    a different ids with you can put into params. EventPaymentReceivedSuccess correspond to 1, EventPaymentSentFailed
     *    to 2 and EventPaymentSentSuccess correspond to 3.
     *  - from_date: Specific from_date to get payments.
     *  - to_date: Specific to_date to get payments.
     *
     *  The format of dates in params follow the ISO 8601 in UTC. For example: 2019-04-11T00:00:00Z
     *  All of this params are optional, and can use in combination with others.
     *  Limit and offset params they must be used together, or only limit.
     *
     * @return {Promise} Payments - Returns a Promise that, when fulfilled, will either return an Array with the
     * payments or an Error with the problem.
     *
     * @example
     *    getPayments({
     *         token_network_identifier: string,
     *         initiator_address: String,
     *         target_address: String,
     *         from_date: String,
     *         to_date: String,
     *         event_type: Integer,
     *         limit: Integer,
     *         offset: Integer,
     *    })
     *
     */
    getPayments(params: {
        token_network_identifier: string,
        initiator_address: String,
        target_address: String,
        from_date: String,
        to_date: String,
        event_type: Integer,
        limit: Integer,
        offset: Integer,
    }): Promise<any>;

    /**
     * Get a list of tokens the node knows about
     *
     * @return {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Array with the
     * token addresses or an Error with the problem.
     */
    getTokens(): Promise<any>;

    /**
     * Get a list of tokens the node knows about
     *
     * @return {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Object with the
     * node's address or an Error with the problem.
     */
    getAddress(): Promise<any>;

    /**
     * Get Joinable channels by token address
     *
     * @param tokenAddresses {String} : list of token addresses separated by commas
     *
     * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
    getJoinableChannels(tokenAddresses: string): Promise<any>;

    /**
     * Get channels
     *
     * @param tokenAddress {String} : an optional tokenAddress to filter by.
     *
     * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
    getChannels(tokenAddress?: string): Promise<any>;

    /**
     * Get channel
     *
     * @param tokenAddress {String} : the mandatory channel token_address.
     * @param partnerAddress {String} : the mandatory channel partner_address.
     *
     * @return {Promise} Channels - Returns a Observable that, when fulfilled, will either return an Array with the
     * channels or an Error with the problem. The channels obtained are only open.
     */
    getChannel(identifier: ChannelIdentifier): Promise<any>;

    /**
     * Search tokens, channels, nodes and rns addresses.
     *
     * @param query - query it's an string that should contain an address
     *                (from nodes, channels, rns addresses or tokens) to be search by lumino.
     * @param onlyReceivers - only search by using node addresses
     *
     * @returns {Promise} Tokens - Returns a Promise that, when fulfilled, will either return an Map with the
     * result search or an Error with the problem. The search result can get contain token addresses matches, node
     * address matches, channel identifier matches and rns address matches.
     */
    search({ query, onlyReceivers }:
        { query: string, onlyReceivers: boolean }): Promise<any>;

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
    openChannel(request: OpenChannelRequest): Promise<any>;

    /**
     * Close an exist channel.
     *
     * @param partnerAddress {String} - For example: 0x3E5B85E29504522DCD923aa503b4C502A64AdB7C
     * @param tokenAddress {String} - For example: 0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42
     * @returns {Promise} close channel response, or error response.
     */
    closeChannel(identifier: ChannelIdentifier): Promise<any>;

    /**
     * Make off chain payment in a channel.
     *
     * @param amountOnWei {number} - Mandatory, the amount has to be on wei
     * @param tokenAddress {String} - Mandatory
     * @param partnerAddress {String} - Mandatory
     *
     * @returns {Promise}
     */
    makePayment(payment: BalanceIdentifier): Promise<any>;

    /**
     * Deposit tokens into a channel
     *
     * @param amountOnWei {number} - Mandatory should be on wei
     * @param tokenAddress {String} - Mandatory
     * @param partnerAddress {String} - Mandatory
     *
     * @returns {Promise} deposit result or error
     */
    depositTokens(deposit: BalanceIdentifier): Promise<any>;

    /**
     * Join into a network creating a new channels with specific token with each node of the
     * network
     *
     * @param fundsOnWei {number} - Mandatory should be on wei
     * @param tokenAddress {string} - Mandatory
     * @param initialChannelTarget {number} - Optional
     * @param joinableFundsTarget {number} - Optional
     *
     * @returns {Promise} with the result response
     */
    joinNetwork({ fundsOnWei, tokenAddress, initialChannelTarget, joinableFundsTarget }:
        { fundsOnWei: number, tokenAddress: string, initialChannelTarget?: number, joinableFundsTarget?: number }): Promise<any>;

    /**
     *  Leave network for specific token
     *
     * @param tokenAddress
     *
     * @returns {Promise}
     */
    leaveNetwork(tokenAddress: string): Promise<any>;
}

}
