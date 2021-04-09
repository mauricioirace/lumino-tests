import {StartedGenericContainer} from "testcontainers/dist/generic-container";
import {StartedTestContainer} from "testcontainers";

export function waitForHealthCheck({command, container, expectedResult, timeoutMS = 60000, waitBeforeStart = 1000}: {
    command: string,
    container: StartedGenericContainer | StartedTestContainer,
    expectedResult?: string,
    timeoutMS?: number,
    waitBeforeStart?: number}): Promise<void> {

    const healthCheck = async () => {
        const result = await container.exec(command.split(' '));
        console.debug('HealthCheck Command Result', result);
        return expectedResult === result.output || result.exitCode === 0;
    }

    return new Promise(async (resolve, reject) => {
        const waitBeforeStartTimeout = setTimeout(async () => {
            const healthCheckTimeout = setTimeout(async () => {
                reject('HealthCheck timeout');
                clearTimeout(healthCheckTimeout);
            }, timeoutMS);
            while(!await healthCheck()) {
                console.debug('Retrying healthCheck');
            }
            resolve();
            clearTimeout(waitBeforeStartTimeout);
        }, waitBeforeStart);
    });
}
