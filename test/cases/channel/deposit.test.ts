import setupTestEnvironment from '../../../src';
import p2p from '../../../topologies/p2p.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode, LuminoNodeList } from '../../../src/types/node';
import { verifyChannel } from '../../utils';
import { ChannelState, State, Timeouts } from '../../common';

interface depositParams {
    token: string;
    amount: number;
    partner: string;
}

describe('channel deposit', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

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
            // starting deposit for node "initiator"
            const initiatorDeposit = toWei(
                p2p.channels[0].participant1.deposit // should be inferred
            );

            // deposit to be made
            const params: depositParams = {
                token: tokenAddresses.LUM,
                amount: toWei(1),
                partner: nodes.target.client.address
            };

            await nodes.initiator.client.sdk.depositTokens({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                partnerAddress: params.partner
            });

            const expected = new ChannelState(
                params.token,
                params.partner,
                initiatorDeposit + params.amount,
                initiatorDeposit + params.amount, // balance should equal deposit
                State.OPEN
            );

            await verifyChannel(
                nodes.initiator.client.sdk,
                params.token,
                params.partner,
                expected
            );
        },
        Timeouts.TEST
    );

    test(
        'target node, 2 tokens',
        async () => {
            // starting deposit for node "target"
            const targetDeposit = toWei(p2p.channels[0].participant2.deposit); // should be inferred

            // deposit to be made
            const params: depositParams = {
                token: tokenAddresses.LUM,
                amount: toWei(2),
                partner: nodes.initiator.client.address
            };

            await nodes.target.client.sdk.depositTokens({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                partnerAddress: params.partner
            });

            const targetExpected = new ChannelState(
                params.token,
                params.partner,
                targetDeposit + params.amount,
                targetDeposit + params.amount, // balance should equal deposit
                State.OPEN
            );

            await verifyChannel(
                nodes.target.client.sdk,
                params.token,
                params.partner,
                targetExpected
            );
        },
        Timeouts.TEST
    );
});
