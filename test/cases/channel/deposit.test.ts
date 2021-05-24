import setupTestEnvironment from '../../../src';
import p2p from '../../../topologies/p2p.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { Dictionary } from '../../../src/util/collection';
import { LuminoNode } from '../../../src/types/node';
import { BalanceIdentifier, ChannelIdentifier } from 'lumino-js-sdk';
import { given } from '../../utils/assertions';
import { Timeouts } from '../../common';

describe('channel deposit', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(p2p);
        nodes = env.nodes as Dictionary<LuminoNode>;
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

            const channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address
            };
            // deposit to be made
            const balance: BalanceIdentifier = {
                ...channelId,
                amountOnWei: toWei(1)
            };

            await nodes.initiator.client.sdk.depositTokens(balance);

            await given(nodes.initiator)
                .expectChannel(channelId)
                .toHaveDeposit(initiatorDeposit + balance.amountOnWei);
        },
        Timeouts.TEST
    );

    test(
        'target node, 2 tokens',
        async () => {
            // starting deposit for node "initiator"
            const targetDeposit = toWei(
                p2p.channels[0].participant2.deposit // should be inferred
            );

            const channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address
            };
            // deposit to be made
            const balance: BalanceIdentifier = {
                ...channelId,
                amountOnWei: toWei(2)
            };

            await nodes.target.client.sdk.depositTokens(balance);

            await given(nodes.target)
                .expectChannel(channelId)
                .toHaveDeposit(targetDeposit + balance.amountOnWei);
        },
        Timeouts.TEST
    );
});
