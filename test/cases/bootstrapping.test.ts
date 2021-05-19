import basic from '../../topologies/basic.json';
import advanced from '../../topologies/advanced.json';
import { SetupJson } from '../../src/types/setup';
import setupTestEnvironment from '../../src';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';

describe('bootstrapping', () => {
    let env: LuminoTestEnvironment;

    afterEach(async () => {
        await env.stop();
    }, TEARDOWN_TIMEOUT);

    it(
        'should be able to boot up a basic node setup',
        async () => {
            env = await setupTestEnvironment(basic as SetupJson);
            await verifyEnv(env);
        },
        SETUP_TIMEOUT
    );

    it(
        'should be able to boot up an advanced node setup',
        async () => {
            env = await setupTestEnvironment(advanced as SetupJson);
            await verifyEnv(env);
        },
        SETUP_TIMEOUT
    );
});
