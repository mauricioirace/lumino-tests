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
    const initiatorDeposit = toWei(
        p2p.channels[0].participant1.deposit // should be inferred
    );
    const targetDeposit = toWei(
        p2p.channels[0].participant2.deposit // should be inferred
    );

    // payment amounts to be made
    const initiatorPaymentAmount = toWei(1);
    const targetPaymentAmount = toWei(2);

    beforeAll(async () => {
        env = await setupTestEnvironment(p2p);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'initiator node, 1 token',
        async () => {
            const params: paymentParams = {
                token: tokenAddresses.LUM,
                partner: nodes.target.client.address,
                amount: initiatorPaymentAmount
            };

            await nodes.initiator.client.sdk.makePayment({
                tokenAddress: params.token,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            let expected = new ChannelState(
                params.token,
                params.partner,
                initiatorDeposit,
                initiatorDeposit - initiatorPaymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.initiator.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // now verify from "target" node

            expected = new ChannelState(
                params.token,
                nodes.initiator.client.address, // should be inferred
                targetDeposit,
                targetDeposit + params.amount,
                State.OPEN
            );

            await verifyChannel(
                nodes.target.client.sdk,
                params.token,
                nodes.initiator.client.address, // should be inferred
                expected
            );
        },
        Timeouts.TEST
    );

    test(
        '2 tokens, target node',
        async () => {
            const params: paymentParams = {
                token: tokenAddresses.LUM,
                partner: nodes.initiator.client.address,
                amount: targetPaymentAmount
            };

            await nodes.target.client.sdk.makePayment({
                tokenAddress: params.token,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            let expected = new ChannelState(
                params.token,
                params.partner,
                targetDeposit,
                targetDeposit + initiatorPaymentAmount - targetPaymentAmount,
                State.OPEN
            );
            await verifyChannel(
                nodes.target.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "initiator" node

            expected = new ChannelState(
                params.token,
                nodes.target.client.address, // should be inferred
                initiatorDeposit,
                initiatorDeposit - initiatorPaymentAmount + targetPaymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.initiator.client.sdk,
                params.token,
                nodes.target.client.address, // should be inferred
                expected
            );
        },
        Timeouts.TEST
    );
});
