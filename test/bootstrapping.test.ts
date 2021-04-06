import LuminoTesting from '../src';
import * as basic from '../sample-toplogies/basic.json';
import * as advanced from '../sample-toplogies/advanced.json';
import {SetupJson} from '../src/types/setup';

describe("Bootstrapping", () => {
    it('should have basic nodes ready', async () => {
        const tester = await LuminoTesting(basic as SetupJson);
        expect(Object.keys(tester.nodes()).length > 0);
    });
    it('should have advanced nodes ready', async () => {
        const tester = await LuminoTesting(advanced as SetupJson);
        expect(Object.keys(tester.nodes()).length > 0);
    });
})
