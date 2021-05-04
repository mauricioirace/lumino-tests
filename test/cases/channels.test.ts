import setupTestEnvironment from '../../src';
import noChannels from '../../topologies/no-channels.json';
import { tokenAddresses, toWei } from '../../src/util/token';
import { LuminoTestEnvironment } from '../../src/types/lumino-test-environment';
import { Dictionary } from '../../src/util/collection';
import { LuminoNode } from '../../src/types/node';
import { ChannelState, ChannelTestCase, verifyChannel } from '../utils';

const SETUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TEARDOWN_TIMEOUT = 1 * 60 * 1000; // 1 minute
const TEST_TIMEOUT = 1 * 60 * 1000; // 1 minute

describe('channels', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(noChannels);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, SETUP_TIMEOUT);

    afterAll(async () => {
        await env.stop();
    }, TEARDOWN_TIMEOUT);

    it(
        'should be able to be opened with no deposit',
        async () => {
            const tc = new ChannelTestCase(
                tokenAddresses.LUM,
                '0x8645315E490A05FeE7EDcF671B096E82D9b616a4',
                toWei(0),
                toWei(0),
                ChannelState.OPEN
            );

            await nodes.initiator.client.sdk.openChannel({
                tokenAddress: tc.token,
                amountOnWei: tc.deposit,
                rskPartnerAddress: tc.partner,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc);
        },
        TEST_TIMEOUT
    );

    it(
        'should be able to have 1 token deposited',
        async () => {
            const tc = new ChannelTestCase(
                tokenAddresses.LUM,
                '0x8645315E490A05FeE7EDcF671B096E82D9b616a4', // previously opened channel
                toWei(1),
                toWei(1),
                ChannelState.OPEN
            );

            await nodes.initiator.client.sdk.depositTokens({
                tokenAddress: tc.token,
                amountOnWei: tc.deposit,
                partnerAddress: tc.partner,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc);
        },
        TEST_TIMEOUT
    );

    it(
        'should be able to be opened with 1 token',
        async () => {
            const tc = new ChannelTestCase(
                tokenAddresses.LUM,
                '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245',
                toWei(1),
                toWei(1),
                ChannelState.OPEN
            );

            await nodes.initiator.client.sdk.openChannel({
                tokenAddress: tc.token,
                amountOnWei: tc.deposit,
                rskPartnerAddress: tc.partner,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc);
        },
        TEST_TIMEOUT
    );

    it(
        'should be able to be closed from the initiator',
        async () => {
            const tc1 = new ChannelTestCase(
                tokenAddresses.LUM,
                '0x8645315E490A05FeE7EDcF671B096E82D9b616a4',
                toWei(1),
                toWei(1),
                ChannelState.CLOSED
            );

            await nodes.initiator.client.sdk.closeChannel({
                tokenAddress: tc1.token,
                partnerAddress: tc1.partner,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc1);

            const tc2 = new ChannelTestCase(
                tokenAddresses.LUM,
                '0x8645315E490A05FeE7EDcF671B096E82D9b616a4',
                toWei(1),
                toWei(1),
                ChannelState.CLOSED
            );

            await nodes.initiator.client.sdk.closeChannel({
                tokenAddress: tc2.token,
                partnerAddress: tc2.partner,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc2);
        },
        TEST_TIMEOUT
    );

    it(
        'should be able to be closed from the partner',
        async () => {
            const tc = new ChannelTestCase(
                tokenAddresses.LUM,
                nodes.target.client.address,
                toWei(0),
                toWei(0),
                ChannelState.CLOSED
            );

            // this channel hasn't been opened yet
            await nodes.initiator.client.sdk.openChannel({
                tokenAddress: tc.token,
                amountOnWei: tc.deposit,
                rskPartnerAddress: tc.partner,
            });

            await nodes.target.client.sdk.closeChannel({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.initiator.client.address,
            });

            await verifyChannel(nodes.initiator.client.sdk, tc);
        },
        TEST_TIMEOUT
    );
});
