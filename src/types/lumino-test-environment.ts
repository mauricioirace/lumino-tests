import { LuminoNodeList } from './node';
import EnvironmentLoader from '../environment-loader';

export class LuminoTestEnvironment {
    get nodes(): LuminoNodeList {
        return this.environmentLoader.getNodes();
    }
    constructor(private environmentLoader: EnvironmentLoader) {}
    async stop() {
        await this.environmentLoader.stop();
    }
}
