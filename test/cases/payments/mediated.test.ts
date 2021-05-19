import { tokenAddresses, toWei } from '../../../src/util/token';
import mediated from '../../../topologies/mediated.json';
import setupTestEnvironment from '../../../src';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode } from '../../../src/types/node';
import { Dictionary } from '../../../src/util/collection';
import { sleep, verifyChannel } from '../../utils';
import { ChannelState, State, Timeouts } from '../../common';

interface paymentParams {
    token: string;
    partner: string;
    amount: number;
}

describe('payments mediated', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    // starting balance for each node
    const initiatorDeposit = toWei(mediated.channels[0].participant1.deposit);
    const mediatorInitiatorDeposit = toWei(
        mediated.channels[0].participant2.deposit
    );
    const mediatorTargetDeposit = toWei(
        mediated.channels[1].participant1.deposit
    );
    const targetDeposit = toWei(mediated.channels[1].participant2.deposit);

    const paymentAmount = toWei(1);

    beforeAll(async () => {
        env = await setupTestEnvironment(mediated);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, Timeouts.SETUP);

    afterAll(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'initiator node, 1 token',
        async () => {
            const params: paymentParams = {
                token: tokenAddresses.LUM,
                partner: nodes.target.client.address,
                amount: paymentAmount
            };

            await nodes.initiator.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: params.partner,
                amountOnWei: params.amount
            });

            await sleep(5000); // should not be necessary

            // verify initiator -> target

            let expected = new ChannelState(
                params.token,
                nodes.mediator.client.address,
                initiatorDeposit,
                initiatorDeposit - paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.initiator.client.sdk,
                params.token,
                nodes.mediator.client.address,
                expected
            );

            expected = new ChannelState(
                params.token,
                params.partner,
                mediatorInitiatorDeposit,
                mediatorInitiatorDeposit - paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.mediator.client.sdk,
                params.token,
                nodes.target.client.address,
                expected
            );

            // now verify target -> initiator

            expected = new ChannelState(
                params.token,
                nodes.mediator.client.address,
                mediatorInitiatorDeposit,
                mediatorInitiatorDeposit + paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.target.client.sdk,
                params.token,
                nodes.mediator.client.address,
                expected
            );

            expected = new ChannelState(
                params.token,
                nodes.initiator.client.address,
                mediatorInitiatorDeposit,
                mediatorInitiatorDeposit + paymentAmount,
                State.OPEN
            );

            await verifyChannel(
                nodes.mediator.client.sdk,
                params.token,
                nodes.initiator.client.address,
                expected
            );
        },
        Timeouts.TEST
    );
});
