import {NodeList} from './node';
import EnvironmentLoader from '../environment-loader';

export class LuminoTestEnvironment {
    get nodes(): NodeList {
        return this.setupLoader.getNodes();
    }
    constructor(private setupLoader: EnvironmentLoader) {}
    async stop() {
        await this.setupLoader.stop();
    }
}
