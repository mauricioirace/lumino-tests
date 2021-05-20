import Lumino, {
    BalanceIdentifier,
    ChannelIdentifier,
    OpenChannelRequest
} from 'lumino-js-sdk';

export default class LuminoClient {
    private constructor(
        public sdk: Lumino,
        public address: string,
        public tokens: any[]
    ) {}

    public static async create(
        luminoNodeBaseUrl: string
    ): Promise<LuminoClient> {
        const sdk = new Lumino(luminoNodeBaseUrl);
        const address = await sdk.getAddress();
        const tokens = await sdk.getTokens();
        return new LuminoClient(sdk, address.our_address, tokens);
    }
}
