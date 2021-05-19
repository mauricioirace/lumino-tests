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
    TEST_TIMEOUT
} from '../../common';

interface closeParams {
    token: string;
    partner: string;
}

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
            // deposit for node "initiator"
            const initiatorDeposit = toWei(
                mediated.channels[0].participant1.deposit // should be inferred
            );

            const params: closeParams = {
                token: tokenAddresses.LUM,
                partner: nodes.mediator.client.address
            };
            await nodes.initiator.client.sdk.closeChannel({
                tokenAddress: params.token,
                partnerAddress: params.partner
            });

            let expected = new ChannelState(
                params.token,
                params.partner,
                initiatorDeposit,
                initiatorDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.initiator.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "mediator" node

            // deposit for node "mediator"
            const mediatorDeposit = toWei(
                mediated.channels[0].participant2.deposit // should be inferred
            );

            expected = new ChannelState(
                params.token,
                nodes.initiator.client.address, // should be inferred
                mediatorDeposit,
                mediatorDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.mediator.client.sdk,
                params.token,
                nodes.initiator.client.address,
                expected
            );
        },
        TEST_TIMEOUT
    );

    it(
        'from target node',
        async () => {
            // deposit for node "target"
            const targetDeposit = toWei(
                mediated.channels[1].participant2.deposit // should be inferred
            );

            const params: closeParams = {
                token: tokenAddresses.LUM,
                partner: nodes.mediator.client.address
            };
            await nodes.target.client.sdk.closeChannel({
                tokenAddress: params.token,
                partnerAddress: params.partner
            });

            let expected = new ChannelState(
                params.token,
                params.partner,
                targetDeposit,
                targetDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.target.client.sdk,
                params.token,
                params.partner,
                expected
            );

            // repeat verification from "mediator" node

            // deposit for node "mediator"
            const mediatorDeposit = toWei(
                mediated.channels[1].participant1.deposit // should be inferred
            );

            expected = new ChannelState(
                params.token,
                nodes.target.client.address, // should be inferred
                mediatorDeposit,
                mediatorDeposit, // balance should equal deposit
                State.CLOSED
            );

            await verifyChannel(
                nodes.mediator.client.sdk,
                params.token,
                nodes.target.client.address,
                expected
            );
        },
        TEST_TIMEOUT
    );
});
