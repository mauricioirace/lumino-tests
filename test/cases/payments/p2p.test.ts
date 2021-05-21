import p2p from '../../../topologies/p2p.json';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode, LuminoNodeList } from '../../../src/types/node';
import setupTestEnvironment from '../../../src';
import { sleep, verifyChannel } from '../../utils';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { ChannelState, State, Timeouts } from '../../common';

interface paymentParams {
    token: string;
    partner: string;
    amount: number;
}

describe('payments p2p', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    // starting deposit for nodes
    const aliceDeposit = toWei(
        p2p.channels[0].participant1.deposit // should be inferred
    );
    const bobDeposit = toWei(
        p2p.channels[0].participant2.deposit // should be inferred
    );

    // payment amounts to be made
    const alicePaymentAmount = toWei(1);
    const bobPaymentAmount = toWei(2);

    beforeAll(async () => {
        env = await setupTestEnvironment(p2p);
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
                partner: nodes.bob.client.address,
                amount: alicePaymentAmount
            };

            await nodes.alice.client.sdk.makePayment({
                tokenAddress: params.token,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            let expected = new ChannelState(
                params.token,
                params.partner,
                aliceDeposit,
                aliceDeposit - alicePaymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.alice.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // now verify from "bob" node

            expected = new ChannelState(
                params.token,
                nodes.alice.client.address, // should be inferred
                bobDeposit,
                bobDeposit + params.amount,
                State.OPEN
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                nodes.alice.client.address, // should be inferred
                expected
            );
        },
        Timeouts.TEST
    );

    test(
        '2 tokens, bob node',
        async () => {
            const params: paymentParams = {
                token: tokenAddresses.LUM,
                partner: nodes.alice.client.address,
                amount: bobPaymentAmount
            };

            await nodes.bob.client.sdk.makePayment({
                tokenAddress: params.token,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            let expected = new ChannelState(
                params.token,
                params.partner,
                bobDeposit,
                bobDeposit + alicePaymentAmount - bobPaymentAmount,
                State.OPEN
            );
            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "alice" node

            expected = new ChannelState(
                params.token,
                nodes.bob.client.address, // should be inferred
                aliceDeposit,
                aliceDeposit - alicePaymentAmount + bobPaymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.alice.client.sdk,
                params.token,
                nodes.bob.client.address, // should be inferred
                expected
            );
        },
        Timeouts.TEST
    );
});
