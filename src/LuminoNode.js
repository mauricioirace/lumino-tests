import Lumino from 'lumino-js-sdk';

export default class LuminoNode {
    constructor({ client, address, tokens }) {
        this.address = address;
        this.client = client;
        this.tokens = tokens;
    }

    static async fromUrl(url) {
        const client = new Lumino({luminoNodeBaseUrl: url});
        const address = await client.getAddress();
        const tokens = await client.getTokens();
        return new LuminoNode({ client, address: address.our_address, tokens });
    }

}