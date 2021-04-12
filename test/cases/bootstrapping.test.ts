import basic from '../../sample-toplogies/basic.json';
import advanced from '../../sample-toplogies/advanced.json';
import {SetupJson} from '../../src/types/setup';
import setupTestEnvironment from '../../src';
import {LuminoTestEnvironment} from '../../src/types/lumino-test-environment';
import {LuminoNode} from '../../src/types/node';
import {isEmpty} from "../utils";

const TIMEOUT = 10 * 60 * 1000;

describe("Bootstrapping Basic", () => {

    let basicEnvironment: LuminoTestEnvironment;

    it('should have basic nodes ready', async () => {
        basicEnvironment = await setupTestEnvironment(basic as SetupJson);
        expect(Object.keys(basicEnvironment.nodes).length).toBe(2);
        const node0 = basicEnvironment.nodes.node0 as LuminoNode;
        const node1 = basicEnvironment.nodes.node1 as LuminoNode;
        const mauriAddress = (await node0.client.sdk.getAddress()).our_address;
        const jonaAddress = (await node1.client.sdk.getAddress()).our_address;
        expect(isEmpty(mauriAddress)).toBe(false);
        expect(isEmpty(jonaAddress)).toBe(false);
    }, TIMEOUT);

    afterAll(async () => {
       await basicEnvironment.stop();
    }, TIMEOUT);

})

describe("Bootstrapping Advanced", () => {

    let advancedEnvironment: LuminoTestEnvironment;

    it('should have advanced nodes ready', async () => {
        advancedEnvironment = await setupTestEnvironment(advanced as SetupJson);
        expect(Object.keys(advancedEnvironment.nodes).length).toBe(2);
        const firstNode = advancedEnvironment.nodes.firstNode as LuminoNode;
        const secondNode = advancedEnvironment.nodes.secondNode as LuminoNode;
        const firstAddress = (await firstNode.client.sdk.getAddress()).our_address;
        const secondAddress = (await secondNode.client.sdk.getAddress()).our_address;
        expect(isEmpty(firstAddress)).toBe(false);
        expect(isEmpty(secondAddress)).toBe(false);
    }, TIMEOUT);

    afterAll(async () => {
        await advancedEnvironment.stop();
    }, TIMEOUT);

})
