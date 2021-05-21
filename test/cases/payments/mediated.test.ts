import { tokenAddresses, toWei } from '../../../src/util/token';
import mediated from '../../../topologies/mediated.json';
import setupTestEnvironment from '../../../src';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode, LuminoNodeList } from '../../../src/types/node';
import { sleep, verifyChannel } from '../../utils';
import { ChannelState, State, Timeouts } from '../../common';

interface paymentParams {
    token: string;
    partner: string;
    amount: number;
}

describe('payments mediated', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    // starting balance for each node
    const aliceDeposit = toWei(mediated.channels[0].participant1.deposit);
    const bobAliceDeposit = toWei(mediated.channels[0].participant2.deposit);

    const paymentAmount = toWei(1);

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'alice node, 1 token',
        async () => {
            const params: paymentParams = {
                token: tokenAddresses.LUM,
                partner: nodes.charlie.client.address,
                amount: paymentAmount
            };

            await nodes.alice.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            // verify alice -> charlie

            let expected = new ChannelState(
                params.token,
                nodes.bob.client.address,
                aliceDeposit,
                aliceDeposit - paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.alice.client.sdk,
                params.token,
                nodes.bob.client.address,
                expected
            );

            expected = new ChannelState(
                params.token,
                params.partner,
                bobAliceDeposit,
                bobAliceDeposit - paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                nodes.charlie.client.address,
                expected
            );

            // now verify charlie -> alice

            expected = new ChannelState(
                params.token,
                nodes.bob.client.address,
                bobAliceDeposit,
                bobAliceDeposit + paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.charlie.client.sdk,
                params.token,
                nodes.bob.client.address,
                expected
            );

            expected = new ChannelState(
                params.token,
                nodes.alice.client.address,
                bobAliceDeposit,
                bobAliceDeposit + paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                nodes.alice.client.address,
                expected
            );
        },
        Timeouts.TEST
    );
});
