import setupTestEnvironment from '../../../src';
import noChannels from '../../../topologies/no-channels.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { Dictionary } from '../../../src/util/collection';
import { LuminoNode } from '../../../src/types/node';
import { verifyChannel } from '../../utils';
import { ChannelState, State, Timeouts } from '../../common';

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
            const params: openParams = {
                token: tokenAddresses.LUM,
                amount: toWei(0),
                partner: '0x8645315E490A05FeE7EDcF671B096E82D9b616a4' // too arbitrary, unrelated to topology
            };

            await nodes.initiator.client.sdk.openChannel({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                rskPartnerAddress: params.partner
            });

            const expected = new ChannelState(
                params.token,
                params.partner,
                params.amount,
                params.amount, // balance should equal deposit
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
        'initiator node, 1 token',
        async () => {
            const params: openParams = {
                token: tokenAddresses.LUM,
                amount: toWei(1),
                partner: '0xb9eA1f16E4f1E5CAF211aF150F2147eEd9Fb2245' // too arbitrary, unrelated to topology
            };

            await nodes.initiator.client.sdk.openChannel({
                tokenAddress: params.token,
                amountOnWei: params.amount,
                rskPartnerAddress: params.partner
            });

            const expected = new ChannelState(
                params.token,
                params.partner,
                params.amount,
                params.amount, // balance should equal deposit
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
});
