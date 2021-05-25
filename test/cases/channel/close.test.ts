import setupTestEnvironment from '../../../src';
import mediated from '../../../topologies/mediated.json';
import { tokenAddresses } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNodeList } from '../../../src/types/node';
import { State, Timeouts } from '../../common';
import { given } from '../../utils/assertions';
import { ChannelParams } from 'lumino-js-sdk';

describe('channel close', () => {
    let nodes: LuminoNodeList;
    let env: LuminoTestEnvironment;

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    it(
        'from alice node',
        async () => {
            const aliceChannel: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address
            };
            const bobChannel: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.alice.client.address
            };

            await nodes.alice.client.sdk.closeChannel(aliceChannel);

            await given(nodes.alice)
                .expectChannel(aliceChannel)
                .toBeInState(State.CLOSED);
            await given(nodes.bob)
                .expectChannel(bobChannel)
                .toBeInState(State.CLOSED);
        },
        Timeouts.TEST
    );

    it(
        'from charlie node',
        async () => {
            const charlieChannel: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.bob.client.address
            };
            const bobChannel: ChannelParams = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.charlie.client.address
            };

            await nodes.charlie.client.sdk.closeChannel(charlieChannel);

            await given(nodes.charlie)
                .expectChannel(charlieChannel)
                .toBeInState(State.CLOSED);
            await given(nodes.bob)
                .expectChannel(bobChannel)
                .toBeInState(State.CLOSED);
        },
        Timeouts.TEST
    );
});
