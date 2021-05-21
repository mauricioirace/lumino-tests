import setupTestEnvironment from '../../../src';
import mediated from '../../../topologies/mediated.json';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode, LuminoNodeList } from '../../../src/types/node';
import { verifyChannel } from '../../utils';
import { ChannelState, State, Timeouts } from '../../common';

interface closeParams {
    token: string;
    partner: string;
}

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
            // deposit for node "alice"
            const aliceDeposit = toWei(
                mediated.channels[0].participant1.deposit // should be inferred
            );

            const params: closeParams = {
                token: tokenAddresses.LUM,
                partner: nodes.bob.client.address
            };
            await nodes.alice.client.sdk.closeChannel({
                tokenAddress: params.token,
                partnerAddress: params.partner
            });

            let expected = new ChannelState(
                params.token,
                params.partner,
                aliceDeposit,
                aliceDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.alice.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "bob" node

            // deposit for node "bob"
            const bobDeposit = toWei(
                mediated.channels[0].participant2.deposit // should be inferred
            );

            expected = new ChannelState(
                params.token,
                nodes.alice.client.address, // should be inferred
                bobDeposit,
                bobDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                nodes.alice.client.address,
                expected
            );
        },
        Timeouts.TEST
    );

    it(
        'from charlie node',
        async () => {
            // deposit for node "charlie"
            const charlieDeposit = toWei(
                mediated.channels[1].participant2.deposit // should be inferred
            );

            const params: closeParams = {
                token: tokenAddresses.LUM,
                partner: nodes.bob.client.address
            };
            await nodes.charlie.client.sdk.closeChannel({
                tokenAddress: params.token,
                partnerAddress: params.partner
            });

            let expected = new ChannelState(
                params.token,
                params.partner,
                charlieDeposit,
                charlieDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.charlie.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "bob" node

            // deposit for node "bob"
            const bobDeposit = toWei(
                mediated.channels[1].participant1.deposit // should be inferred
            );

            expected = new ChannelState(
                params.token,
                nodes.charlie.client.address, // should be inferred
                bobDeposit,
                bobDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.bob.client.sdk,
                params.token,
                nodes.charlie.client.address,
                expected
            );
        },
        Timeouts.TEST
    );
});
