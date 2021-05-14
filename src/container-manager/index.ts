import { SetupNode } from '../types/setup';
import { LuminoNode } from '../types/node';
import {
    DockerComposeEnvironment,
    GenericContainer,
    StartedDockerComposeEnvironment,
    StartedTestContainer
} from 'testcontainers';
import path from 'path';
import { StartedGenericContainer } from 'testcontainers/dist/generic-container';
import { waitForHealthCheck } from '../types/wait';
import { DOCKER_NETWORK_NAME, Token } from '../constants';
import LuminoClient from '../lumino-client';

export default class ContainerManager {
    private rskNodeEnvironment?: StartedDockerComposeEnvironment;
    private explorerEnvironment?: StartedDockerComposeEnvironment;
    private rifCommsBootNode?: StartedTestContainer;
    private luminoNodes: LuminoNode[] = [];

    private constructor() {}

    static create(): ContainerManager {
        return new ContainerManager();
    }

    public async startRskNode(): Promise<StartedDockerComposeEnvironment> {
        console.debug('Starting rsk node...');
        this.rskNodeEnvironment = await this.startDockerComposeModule(
            path.resolve(__dirname, 'docker-files/rsk-node')
        );
        await waitForHealthCheck({
            command: 'healthCheck',
            expectedResult: 'NODE ONLINE',
            container: this.rskNodeEnvironment.getContainer('rsk-node')
        });
        console.debug('Started rsk node successfully');
        return this.rskNodeEnvironment;
    }

    public async startExplorer(): Promise<StartedDockerComposeEnvironment> {
        console.debug('Starting lumino explorer...');
        this.explorerEnvironment = await this.startDockerComposeModule(
            path.resolve(__dirname, 'docker-files/lumino-explorer')
        );
        await waitForHealthCheck({
            command: 'healthCheck',
            expectedResult: 'NODE ONLINE',
            container: this.explorerEnvironment.getContainer('lumino-explorer')
        });
        console.debug('Started lumino explorer successfully');
        return this.explorerEnvironment;
    }

    public async startNotifier(
        instanceNumber: number
    ): Promise<StartedGenericContainer> {
        throw new Error('NOT_IMPLEMENTED');
    }

    private async startDockerComposeModule(
        buildContext: string
    ): Promise<StartedDockerComposeEnvironment> {
        return await new DockerComposeEnvironment(
            buildContext,
            `docker-compose.yml`
        ).up();
    }

    public getContainer(
        containerName:
            | 'rsk-node'
            | 'lumino-explorer'
            | 'mongo-db'
            | 'lumino-node'
            | 'boot-node',
        luminoNodeName?: string,
        scaleNumber?: number
    ): StartedGenericContainer | StartedTestContainer | undefined {
        switch (containerName) {
            case 'rsk-node':
                return this.rskNodeEnvironment?.getContainer(containerName);
            case 'lumino-explorer':
            case 'mongo-db':
                return this.explorerEnvironment?.getContainer(containerName);
            case 'lumino-node':
                return this.luminoNodes.find(
                    (node) => node.name === luminoNodeName
                )?.container;
            case 'boot-node':
                return this.rifCommsBootNode;
        }
    }

    public async startupRifCommunicationsBootNode(): Promise<void> {
        console.debug('Creating rif-comms boot node...');
        let rifCommsBootNodeContainer: GenericContainer = new GenericContainer(
            'lumino-testing-rif-comms-boot-node-image:latest'
        );
        rifCommsBootNodeContainer = rifCommsBootNodeContainer
            .withNetworkMode(DOCKER_NETWORK_NAME)
            .withName('lumino-testing-rif-comms-boot-node');
        const rifCommsBootNodeStartedContainer =
            await rifCommsBootNodeContainer.start();
        await waitForHealthCheck({
            command: 'healthCheck',
            expectedResult: 'NODE ONLINE',
            container: rifCommsBootNodeStartedContainer
        });
        this.rifCommsBootNode = rifCommsBootNodeStartedContainer;
        console.debug('Rif comms boot node successfully started.');
    }

    public async startupLuminoNode(nodeConfig: SetupNode): Promise<LuminoNode> {
        console.debug('Creating lumino node', nodeConfig);

        if (!this.rifCommsBootNode) {
            return Promise.reject('No rif-communications boot node up.');
        }

        let luminoNodeContainer: GenericContainer = new GenericContainer(
            'lumino-testing-lumino-node-image:latest'
        );

        luminoNodeContainer =
            luminoNodeContainer.withNetworkMode(DOCKER_NETWORK_NAME);

        if (nodeConfig.enableHub) {
            console.debug(`Setup Hub Mode to lumino node ${nodeConfig.name}`);
            luminoNodeContainer = luminoNodeContainer.withEnv(
                'HUB_MODE',
                'enabled'
            );
        }

        if (nodeConfig.tokens) {
            for (const tokenSetup of nodeConfig.tokens) {
                switch (tokenSetup.symbol) {
                    case Token.LUM.toString():
                        console.debug(
                            `Setup ${tokenSetup.amount} lumino tokens to lumino node ${nodeConfig.name}`
                        );
                        luminoNodeContainer = luminoNodeContainer.withEnv(
                            'LUM_FUNDS',
                            tokenSetup.amount.toString()
                        );
                        break;
                    case Token.RIF.toString():
                        console.debug(
                            `Setup ${tokenSetup.amount} rif tokens to lumino node ${nodeConfig.name}`
                        );
                        luminoNodeContainer = luminoNodeContainer.withEnv(
                            'RIF_FUNDS',
                            tokenSetup.amount.toString()
                        );
                        break;
                }
            }
        }

        console.debug(`Starting lumino node ${nodeConfig.name}`);

        const containerName = `lumino-testing-lumino-node-${this.luminoNodes.length}`;

        luminoNodeContainer.withEnv(
            'BOOT_NODE_IP',
            await this.rifCommsBootNode.getIpAddress(DOCKER_NETWORK_NAME)
        );
        luminoNodeContainer.withName(containerName);

        const startedContainer: StartedTestContainer =
            await luminoNodeContainer.start();

        await waitForHealthCheck({
            command: 'healthCheck',
            expectedResult: 'NODE ONLINE',
            container: startedContainer
        });

        const containerIp: string =
            startedContainer.getIpAddress(DOCKER_NETWORK_NAME);

        const luminoNodeBaseUrl = `http://${containerIp}:5001/api/v1`;

        console.debug(
            `Creating sdk for lumino node ${nodeConfig.name} with luminoNodeBaseUrl=${luminoNodeBaseUrl}`
        );

        const sdk = await LuminoClient.create(luminoNodeBaseUrl);

        const luminoNode: LuminoNode = {
            name: nodeConfig.name,
            client: sdk,
            container: startedContainer
        };

        this.luminoNodes.push(luminoNode);

        return luminoNode;
    }

    public async stopAll(): Promise<void> {
        await this.rskNodeEnvironment?.down();
        await this.explorerEnvironment?.down();
        for (const luminoNode of this.luminoNodes) {
            await luminoNode.container.stop({ removeVolumes: true });
        }
        await this.rifCommsBootNode?.stop({ removeVolumes: true });
    }
}
