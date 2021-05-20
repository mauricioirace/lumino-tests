import { tokenAddresses, toWei } from '../../../src/util/token';
import mediated from '../../../topologies/mediated.json';
import setupTestEnvironment from '../../../src';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode } from '../../../src/types/node';
import { Dictionary } from '../../../src/util/collection';
import { given } from '../../utils/assertions';
import { BalanceIdentifier, ChannelIdentifier } from 'lumino-js-sdk';
import { Timeouts } from '../../common';

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
            const payment: BalanceIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address,
                amountOnWei: paymentAmount
            };

            await nodes.initiator.client.sdk.makePayment(payment);

            // verify initiator -> target
            await given(nodes.initiator)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.mediator.client.address
                })
                .toHaveBalance(initiatorDeposit - paymentAmount);

            await given(nodes.mediator)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.target.client.address
                })
                .toHaveBalance(mediatorTargetDeposit - paymentAmount);

            // now verify target -> initiator

            await given(nodes.target)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.mediator.client.address
                })
                .toHaveBalance(targetDeposit + paymentAmount);

            await given(nodes.mediator)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.initiator.client.address
                })
                .toHaveBalance(mediatorInitiatorDeposit + paymentAmount);
        },
        Timeouts.TEST
    );
});
