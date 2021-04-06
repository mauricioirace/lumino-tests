import * as basic from '../sample-toplogies/basic.json';
import * as advanced from '../sample-toplogies/advanced.json';
import {SetupJson} from '../src/types/setup';
import setupTestEnvironment from '../src';
import {LuminoTestEnvironment} from "../src/types/lumino-test-environment";

const TIMEOUT = 10 * 60 * 1000;

describe("Bootstrapping Basic", () => {

    let basicEnvironment: LuminoTestEnvironment;

    it('should have basic nodes ready', async () => {
        basicEnvironment = await setupTestEnvironment(basic as SetupJson);
        expect(Object.keys(basicEnvironment.nodes).length > 0);
    }, TIMEOUT);

    afterAll(async () => {
       await basicEnvironment.stop();
    }, TIMEOUT);

})

describe("Bootstrapping Advanced", () => {

    let advancedEnvironment: LuminoTestEnvironment;

    it('should have basic nodes ready', async () => {
        advancedEnvironment = await setupTestEnvironment(advanced as SetupJson);
        expect(Object.keys(advancedEnvironment.nodes).length > 0);
    }, TIMEOUT);

    afterAll(async () => {
        await advancedEnvironment.stop();
    }, TIMEOUT);

})
