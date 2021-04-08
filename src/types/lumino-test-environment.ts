import {NodeList} from './node';
import EnvironmentLoader from '../environment-loader';

export class LuminoTestEnvironment {
    get nodes(): NodeList {
        return this.environmentLoader.getNodes();
    }
    constructor(private environmentLoader: EnvironmentLoader) {}
    async stop() {
        await this.environmentLoader.stop();
    }
}
