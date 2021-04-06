import * as basic from '../sample-toplogies/basic.json';
import * as advanced from '../sample-toplogies/advanced.json';
import {SetupJson} from '../src/types/setup';
import setupTestEnvironment from '../src';

describe("Bootstrapping", () => {
    it('should have basic nodes ready', async () => {
        const testEnvironment = await setupTestEnvironment(basic as SetupJson);
        expect(Object.keys(testEnvironment.nodes).length > 0);
    });
    it('should have advanced nodes ready', async () => {
        const testEnvironment = await setupTestEnvironment(advanced as SetupJson);
        expect(Object.keys(testEnvironment.nodes).length > 0);
    });
})
