import path from "path";
import {DockerComposeEnvironment, StartedDockerComposeEnvironment} from "testcontainers";
import {StartedGenericContainer} from "testcontainers/dist/generic-container";

export default class DockerManager {

    private constructor(private dockerComposeEnvironment: StartedDockerComposeEnvironment) {}

    static async create(chainName: string): Promise<DockerManager> {
        const dockerComposeEnvironment: StartedDockerComposeEnvironment = await new DockerComposeEnvironment(
            path.resolve(__dirname, 'docker-files'),
            `docker-compose.${chainName}.yml`
        ).up();
        const dockerManager: DockerManager = new DockerManager(dockerComposeEnvironment)
        return Promise.resolve(dockerManager);
    }

    public getContainer(containerName: 'rsk-node' | 'lumino-explorer' | 'rif-notifier', scaleNumber?: number): StartedGenericContainer {
        return this.dockerComposeEnvironment.getContainer(containerName);
    }

    public async destroy(): Promise<void> {
        await this.dockerComposeEnvironment.down();
    }

}
