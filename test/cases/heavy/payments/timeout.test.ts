import setupTestEnvironment from '../../../../src';
import noChannels from '../../../../topologies/no-channels.json';
import { tokenAddresses, toWei } from '../../../../src/util/token';
import { LuminoTestEnvironment } from '../../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../../src/types/node';
import { Timeouts } from '../../../common';
import { ChannelParams, OpenChannelParams } from 'lumino-js-sdk';
import { given } from '../../../utils/assertions';

describe('payment timeout', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;
    let channelWithOfflineNode: ChannelParams;

    beforeAll(async () => {
        env = await setupTestEnvironment(noChannels);
        nodes = env.nodes;
        channelWithOfflineNode = {
            tokenAddress: tokenAddresses.LUM,
            // TODO: Generate address somehow else
            partnerAddress: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4'
        };
        const openChannel: OpenChannelParams = {
            tokenAddress: channelWithOfflineNode.tokenAddress,
            amountOnWei: toWei(1),
            rskPartnerAddress: channelWithOfflineNode.partnerAddress // too arbitrary, unrelated to topology
        };

        await nodes.alice.client.sdk.openChannel(openChannel);
        await nodes.bob.client.sdk.openChannel(openChannel);
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    it(
        'should timeout p2p payment after 50 blocks',
        async () => {
            await expect(
                nodes.alice.client.sdk.makePayment({
                    ...channelWithOfflineNode,
                    amountOnWei: toWei(1)
                })
            ).rejects.toEqual({
                errors: "Payment couldn't be completed (insufficient funds, no route to target or target offline)."
            });
            await given(nodes.alice)
                .expectChannel(channelWithOfflineNode)
                .toHaveBalance(toWei(1));
            // TODO: check that 50 blocks have passed
            // We could use @open-zeppelin/test-helpers
        },
        Timeouts.TEST
    );
    it(
        'should timeout mediated payment after 50 blocks',
        async () => {
            // bob -> ?? -> Alice
            await expect(
                nodes.bob.client.sdk.makePayment({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.alice.client.address,
                    amountOnWei: toWei(1)
                })
            ).rejects.toEqual({
                errors: "Payment couldn't be completed (insufficient funds, no route to target or target offline)."
            });
            await given(nodes.alice)
                .expectChannel(channelWithOfflineNode)
                .toHaveBalance(toWei(1));
            await given(nodes.bob)
                .expectChannel(channelWithOfflineNode)
                .toHaveBalance(toWei(1));
            // TODO: check that 50 blocks have passed
            // We could use @open-zeppelin/test-helpers
        },
        Timeouts.TEST
    );
});
