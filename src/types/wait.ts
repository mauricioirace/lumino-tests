import { StartedGenericContainer } from 'testcontainers/dist/generic-container';
import { StartedTestContainer } from 'testcontainers';

export function waitForHealthCheck({
    command,
    container,
    expectedResult,
    timeoutMS = 60000,
    waitBeforeStart = 1000,
}: {
    command: string;
    container: StartedGenericContainer | StartedTestContainer;
    expectedResult?: string;
    timeoutMS?: number;
    waitBeforeStart?: number;
}): Promise<void> {
    console.debug(`Running HealthCheck for container ${container.getName()}`);

    const healthCheck = async () => {
        const result = await container.exec(command.split(' '));
        console.debug(
            `HealthCheck Command Result for container ${container.getName()}`,
            result
        );
        return expectedResult === result.output || result.exitCode === 0;
    };

    return new Promise(async (resolve, reject) => {
        const waitBeforeStartTimeout = setTimeout(async () => {
            const healthCheckTimeout = setTimeout(async () => {
                reject(
                    `HealthCheck timeout for container ${container.getName()}`
                );
                clearTimeout(healthCheckTimeout);
            }, timeoutMS);
            while (!(await healthCheck())) {
                console.debug(
                    `Retrying healthCheck for container ${container.getName()}`
                );
            }
            resolve();
            clearTimeout(waitBeforeStartTimeout);
        }, waitBeforeStart);
    });
}
