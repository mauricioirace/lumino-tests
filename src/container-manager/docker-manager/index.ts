import {GenericContainer, StartedTestContainer, Wait} from "testcontainers";
import {SetupJson} from "../../types/setup";

const NETWORK_NAME: string = 'rsk-network';

export default class DockerManager {

    private constructor(private rskContainer: StartedTestContainer) {}

    static async create(setup: SetupJson): Promise<DockerManager> {
        console.log('Creating rsk container');
        const rskContainer = await new GenericContainer("rsk-node-image:latest")
            .withExposedPorts(4444, 30305)
            .withNetworkMode(NETWORK_NAME)
            .withHealthCheck({
                test: "curl -s http://localhost:4444 -X POST -H \"Content-Type: application/json\" --data '{\"jsonrpc\":\"2.0\",\"method\":\"web3_clientVersion\",\"params\": [],\"id\":1}' || exit 1",
                interval: 5000,
                timeout: 20000,
                retries: 5,
                startPeriod: 10000
            })
            .withWaitStrategy(Wait.forHealthCheck())
            .start();
        console.log('Creating docker manager');
        return Promise.resolve(new DockerManager(rskContainer));
    }

    public getContainer(
        containerName: 'rsk-node' | 'lumino-explorer' | 'rif-notifier',
        scaleNumber?: number): StartedTestContainer {
        switch (containerName) {
            case "rsk-node":
                return this.rskContainer;
            case "lumino-explorer":
            case "rif-notifier":
                throw new Error("NOT_IMPLEMENTED");
        }
    }

    public async destroy(): Promise<void> {
        await this.rskContainer.stop({removeVolumes: true});
    }

}
