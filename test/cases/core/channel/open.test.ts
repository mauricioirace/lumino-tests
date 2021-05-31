import setupTestEnvironment from '../../../../src';
import noChannels from '../../../../topologies/no-channels.json';
import { tokenAddresses, toWei } from '../../../../src/util/token';
import { LuminoTestEnvironment } from '../../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../../src/types/node';
import { State, Timeouts } from '../../../common';
import { ChannelParams, OpenChannelParams } from 'lumino-js-sdk';
import { given } from '../../../utils/assertions';

describe('channel open', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(noChannels);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    it(
        'should open channel with 0 tokens',
        async () => {
            const channelParams: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
            };
            const openChannel: OpenChannelParams = {
                tokenAddress: channelParams.tokenAddress,
                amountOnWei: toWei(0),
                rskPartnerAddress: channelParams.partnerAddress // too arbitrary, unrelated to topology
            };

            await nodes.alice.client.sdk.openChannel(openChannel);

            await given(nodes.alice)
                .expectChannel(channelParams)
                .toBe({
                    token: channelParams.tokenAddress,
                    partner: channelParams.partnerAddress,
                    deposit: toWei(0),
                    balance: toWei(0),
                    state: State.OPEN
                });
        },
        Timeouts.TEST
    );

    it(
        'should open channel with 1 token',
        async () => {
            const channelId: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245'
            };
            const openChannelRequest: OpenChannelParams = {
                tokenAddress: channelId.tokenAddress,
                amountOnWei: toWei(1),
                rskPartnerAddress: channelId.partnerAddress // too arbitrary, unrelated to topology
            };

            await nodes.alice.client.sdk.openChannel(openChannelRequest);
            await given(nodes.alice)
                .expectChannel(channelId)
                .toBe({
                    token: channelId.tokenAddress,
                    partner: channelId.partnerAddress,
                    deposit: toWei(1),
                    balance: toWei(1),
                    state: State.OPEN
                });
        },
        Timeouts.TEST
    );

    it(
        'should open 2 channel with different tokens',
        async () => {
            const lumChannel: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address
            };
            const openLumChannel: OpenChannelParams = {
                tokenAddress: lumChannel.tokenAddress,
                amountOnWei: toWei(0),
                rskPartnerAddress: lumChannel.partnerAddress // too arbitrary, unrelated to topology
            };
            const rifChannel: ChannelParams = {
                tokenAddress: tokenAddresses.RIF,
                partnerAddress: nodes.bob.client.address
            };
            const openRifChannel: OpenChannelParams = {
                tokenAddress: rifChannel.tokenAddress,
                amountOnWei: toWei(0),
                rskPartnerAddress: rifChannel.partnerAddress // too arbitrary, unrelated to topology
            };
            // Open two channels, one with lumino token, and the other one with rif
            await nodes.alice.client.sdk.openChannel(openLumChannel);
            await nodes.alice.client.sdk.openChannel(openRifChannel);

            await given(nodes.alice)
                .expectChannel(lumChannel)
                .toBe({
                    token: lumChannel.tokenAddress,
                    partner: lumChannel.partnerAddress,
                    deposit: toWei(0),
                    balance: toWei(0),
                    state: State.OPEN
                });
            await given(nodes.alice)
                .expectChannel(rifChannel)
                .toBe({
                    token: rifChannel.tokenAddress,
                    partner: rifChannel.partnerAddress,
                    deposit: toWei(0),
                    balance: toWei(0),
                    state: State.OPEN
                });
        },
        Timeouts.TEST
    );
});
