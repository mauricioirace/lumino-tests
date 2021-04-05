import Lumino from 'lumino-js-sdk';

export class LuminoNode {

    private address: string;
    private client: Lumino;
    private tokens: any[];

    constructor({ client, address, tokens }) {
        this.address = address;
        this.client = client;
        this.tokens = tokens;
    }

    static async fromUrl(luminoNodeBaseUrl) {
        const client = new Lumino({luminoNodeBaseUrl});
        return new LuminoNode({
            client,
            address: await client.getAddress().our_address,
            tokens: await client.getTokens()
        });
    }

}
