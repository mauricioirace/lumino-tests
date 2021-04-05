import LuminoTesting from "../src";
import * as basic from '../samples/basic.json';
import * as advanced from '../samples/advanced.json';
import {SetupJson} from "setup";

describe("Bootstrapping", () => {
    it('should have basic nodes ready', async () => {
        const tester = await LuminoTesting(basic as SetupJson);
        expect(tester.nodes().length > 0)
    });
    it('should have advanced nodes ready', async () => {
        const tester = await LuminoTesting(advanced as SetupJson);
        expect(tester.nodes().length > 0)
    });
})
