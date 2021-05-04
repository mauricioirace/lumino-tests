import { tokenAddresses, toWei } from '../../src/util/token';
import mediated from '../../topologies/mediated.json';
import setupTestEnvironment from '../../src';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';
import { LuminoNode } from '../../src/types/node';
import { Dictionary } from '../../src/util/collection';
import { ChannelState, ChannelTestCase, sleep, verifyChannel } from '../utils';

const SETUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TEARDOWN_TIMEOUT = 1 * 60 * 1000; // 1 minute
const TEST_TIMEOUT = 1 * 60 * 1000; // 1 minute

describe('mediated payments', () => {
    let nodes: Dictionary<LuminoNode>;
    let tester: LuminoTestEnvironment;

    // starting balance for each node
    const initiatorDeposit = mediated.channels[0].participant1.deposit;
    const mediatorDeposit = mediated.channels[0].participant2.deposit;
    const targetDeposit = mediated.channels[1].participant2.deposit;

    // amount for payment to be made
    const initiatorPayment = 1;

    beforeAll(async () => {
        tester = await setupTestEnvironment(mediated);
        nodes = tester.nodes as Dictionary<LuminoNode>;
    }, SETUP_TIMEOUT);

    afterAll(async () => {
        await tester.stop();
    }, TEARDOWN_TIMEOUT);

    it(
        'should be able to be made',
        async () => {
            const tcInitiator = new ChannelTestCase(
                tokenAddresses.LUM,
                nodes.mediator.client.address,
                toWei(initiatorDeposit),
                toWei(initiatorDeposit - initiatorPayment),
                ChannelState.OPEN
            );

            const tcMediatorInitiator = new ChannelTestCase(
                tokenAddresses.LUM,
                nodes.initiator.client.address,
                toWei(mediatorDeposit),
                toWei(mediatorDeposit + initiatorPayment),
                ChannelState.OPEN
            );

            const tcMediatorTarget = new ChannelTestCase(
                tokenAddresses.LUM,
                nodes.target.client.address,
                toWei(mediatorDeposit),
                toWei(mediatorDeposit - initiatorPayment),
                ChannelState.OPEN
            );

            const tcTarget = new ChannelTestCase(
                tokenAddresses.LUM,
                nodes.mediator.client.address,
                toWei(targetDeposit),
                toWei(targetDeposit + initiatorPayment),
                ChannelState.OPEN
            );

            await nodes.initiator.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address,
                amountOnWei: toWei(initiatorPayment),
            });

            await sleep(5000);

            // verify both channels from each end
            await verifyChannel(nodes.initiator.client.sdk, tcInitiator);
            await verifyChannel(nodes.mediator.client.sdk, tcMediatorInitiator);
            await verifyChannel(nodes.mediator.client.sdk, tcMediatorTarget);
            await verifyChannel(nodes.target.client.sdk, tcTarget);
        },
        TEST_TIMEOUT
    );
});
