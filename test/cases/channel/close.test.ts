import setupTestEnvironment from '../../../src';
import mediated from '../../../topologies/mediated.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { Dictionary } from '../../../src/util/collection';
import { LuminoNode } from '../../../src/types/node';
import { verifyChannel } from '../../utils';
import {
    SETUP_TIMEOUT,
    TEARDOWN_TIMEOUT,
    ChannelState,
    State,
    TEST_TIMEOUT,
} from '../../common';
import { given } from '../../utils/assertions';
import { ChannelIdentifier } from 'lumino-js-sdk';


describe('channel close', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, SETUP_TIMEOUT);

    afterAll(async () => {
        await env.stop();
    }, TEARDOWN_TIMEOUT);

    it(
        'from initiator node',
        async () => {
            let channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.mediator.client.address,
            };
            let inverseChannelId = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.initiator.client.address,
            };

            await nodes.initiator.client.sdk.closeChannel(channelId);

            await given(nodes.initiator).expectChannel(channelId).toBeInState(State.CLOSED);
            await given(nodes.mediator).expectChannel(inverseChannelId).toBeInState(State.CLOSED);
        },
        TEST_TIMEOUT
    );

    it(
        'from target node',
        async () => {
            
            let channelId: ChannelIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.mediator.client.address,
            };
            let inverseChannelId = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address,
            };

            await nodes.target.client.sdk.closeChannel(channelId);

            await given(nodes.target).expectChannel(channelId).toBeInState(State.CLOSED);
            await given(nodes.mediator).expectChannel(inverseChannelId).toBeInState(State.CLOSED);
        },
        TEST_TIMEOUT
    );
});
