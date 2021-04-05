import Lumino from 'lumino-js-sdk';

export default class LuminoClient {

    client: Lumino;
    address: string;
    tokens: any[];

    async constructor(luminoNodeBaseUrl) {
        this.client = new Lumino({luminoNodeBaseUrl});
        this.address = await this.client.getAddress();
        this.tokens = await this.client.getTokens();
    }

}
