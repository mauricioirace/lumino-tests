import LuminoTesting from "../src";
import * as basic from '../samples/basic.json';
import * as advanced from '../samples/advanced.json';

describe("Bootstrapping", () => {
    it('should have basic nodes ready', async () => {
        const tester = LuminoTesting(basic);
        expect(tester.nodes !== null && tester.nodes !== undefined && tester.nodes().length > 0)
    });
    it('should have advanced nodes ready', async () => {
        const tester = LuminoTesting(advanced);
        expect(tester.nodes !== null && tester.nodes !== undefined && tester.nodes().length > 0)
    });
})
