import setupTestEnvironment from '../../../src';
import noChannels from '../../../topologies/no-channels.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { Dictionary } from '../../../src/util/collection';
import { LuminoNode } from '../../../src/types/node';
import { State, Timeouts } from '../../common';
import { ChannelIdentifier, OpenChannelRequest } from 'lumino-js-sdk';
import { given } from '../../utils/assertions';

interface openParams {
    token: string;
    amount: number;
    partner: string;
}

describe('channel open', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(noChannels);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'initiator node, 0 tokens',
        async () => {
            const channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
            };
            const openChannelRequest: OpenChannelRequest = {
                tokenAddress: channelId.tokenAddress,
                amountOnWei: toWei(0),
                rskPartnerAddress: channelId.partnerAddress // too arbitrary, unrelated to topology
            };

            await nodes.initiator.client.sdk.openChannel(openChannelRequest);

            await given(nodes.initiator)
                .expectChannel(channelId)
                .toBeInState(State.OPEN);
            await given(nodes.initiator)
                .expectChannel(channelId)
                .toHaveBalance(toWei(0));
            await given(nodes.initiator)
                .expectChannel(channelId)
                .toHaveDeposit(toWei(0));
        },
        Timeouts.TEST
    );

    test(
        'initiator node, 1 token',
        async () => {
            const channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245'
            };
            const openChannelRequest: OpenChannelRequest = {
                tokenAddress: channelId.tokenAddress,
                amountOnWei: toWei(1),
                rskPartnerAddress: channelId.partnerAddress // too arbitrary, unrelated to topology
            };

            await nodes.initiator.client.sdk.openChannel(openChannelRequest);

            await given(nodes.initiator)
                .expectChannel(channelId)
                .toBeInState(State.OPEN);
            await given(nodes.initiator)
                .expectChannel(channelId)
                .toHaveBalance(toWei(1));
            await given(nodes.initiator)
                .expectChannel(channelId)
                .toHaveDeposit(toWei(1));
        },
        Timeouts.TEST
    );
});
