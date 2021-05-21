import setupTestEnvironment from '../../../src';
import p2p from '../../../topologies/p2p.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../src/types/node';
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
        'alice node, 1 token',
        async () => {
            // starting deposit for node "alice"
            const aliceDeposit = toWei(
                p2p.channels[0].participant1.deposit // should be inferred
            );

            // deposit to be made
            const params: depositParams = {
                token: tokenAddresses.LUM,
                amount: toWei(1),
                partner: nodes.bob.client.address
            };

            await nodes.alice.client.sdk.depositTokens({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                partnerAddress: params.partner
            });

            const expected = new ChannelState(
                params.token,
                params.partner,
                aliceDeposit + params.amount,
                aliceDeposit + params.amount, // balance should equal deposit
                State.OPEN
            );

            await verifyChannel(
                nodes.alice.client.sdk,
                params.token,
                params.partner,
                expected
            );
        },
        Timeouts.TEST
    );

    test(
        'bob node, 2 tokens',
        async () => {
            // starting deposit for node "bob"
            const bobDeposit = toWei(p2p.channels[0].participant2.deposit); // should be inferred

            // deposit to be made
            const params: depositParams = {
                token: tokenAddresses.LUM,
                amount: toWei(2),
                partner: nodes.alice.client.address
            };

            await nodes.bob.client.sdk.depositTokens({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                partnerAddress: params.partner
            });

            const bobExpected = new ChannelState(
                params.token,
                params.partner,
                bobDeposit + params.amount,
                bobDeposit + params.amount, // balance should equal deposit
                State.OPEN
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                params.partner,
                bobExpected
            );
        },
        Timeouts.TEST
    );
});
