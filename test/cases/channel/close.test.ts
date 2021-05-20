import setupTestEnvironment from '../../../src';
import mediated from '../../../topologies/mediated.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { Dictionary } from '../../../src/util/collection';
import { LuminoNode } from '../../../src/types/node';
import { State, Timeouts } from '../../common';
import { given } from '../../utils/assertions';
import { ChannelIdentifier } from 'lumino-js-sdk';

describe('channel close', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    it(
        'from initiator node',
        async () => {
            let channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.mediator.client.address
            };
            let inverseChannelId = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.initiator.client.address
            };

            await nodes.initiator.client.sdk.closeChannel(channelId);

            await given(nodes.initiator)
                .expectChannel(channelId)
                .toBeInState(State.CLOSED);
            await given(nodes.mediator)
                .expectChannel(inverseChannelId)
                .toBeInState(State.CLOSED);
        },
        Timeouts.TEST
    );

    it(
        'from target node',
        async () => {
            let channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.mediator.client.address
            };
            let inverseChannelId = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address
            };

            await nodes.target.client.sdk.closeChannel(channelId);

            await given(nodes.target)
                .expectChannel(channelId)
                .toBeInState(State.CLOSED);
            await given(nodes.mediator)
                .expectChannel(inverseChannelId)
                .toBeInState(State.CLOSED);
        },
        Timeouts.TEST
    );
});
