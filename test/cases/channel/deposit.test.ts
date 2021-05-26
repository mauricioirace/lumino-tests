import setupTestEnvironment from '../../../src';
import p2p from '../../../topologies/p2p.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../src/types/node';
import { Timeouts } from '../../common';
import { ChannelParams, DepositParams } from 'lumino-js-sdk';
import { given } from '../../utils/assertions';

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
            const aliceInitialDeposit = toWei(
                p2p.channels[0].participant1.deposit // should be inferred
            );

            const channelId: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address
            };
            // deposit to be made
            const aliceDeposit: DepositParams = {
                ...channelId,
                amountOnWei: toWei(1)
            };

            await nodes.alice.client.sdk.depositTokens(aliceDeposit);

            await given(nodes.alice)
                .expectChannel(channelId)
                .toHaveDeposit(aliceInitialDeposit + aliceDeposit.amountOnWei);
        },
        Timeouts.TEST
    );

    test(
        'bob node, 2 tokens',
        async () => {
            // starting deposit for node "alice"
            const bobInitialDeposit = toWei(
                p2p.channels[0].participant2.deposit // should be inferred
            );

            const channelId: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address
            };
            // deposit to be made
            const bobDeposit: DepositParams = {
                ...channelId,
                amountOnWei: toWei(2)
            };

            await nodes.bob.client.sdk.depositTokens(bobDeposit);

            await given(nodes.bob)
                .expectChannel(channelId)
                .toHaveDeposit(bobInitialDeposit + bobDeposit.amountOnWei);
        },
        Timeouts.TEST
    );
});
