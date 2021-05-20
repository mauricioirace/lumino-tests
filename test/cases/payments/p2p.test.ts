import p2p from '../../../topologies/p2p.json';
import { LuminoTestEnvironment } from '../../../src/types/lumino-test-environment';
import { LuminoNode } from '../../../src/types/node';
import { Dictionary } from '../../../src/util/collection';
import setupTestEnvironment from '../../../src';
import { tokenAddresses, toWei } from '../../../src/util/token';
import { Timeouts } from '../../common';
import { BalanceIdentifier } from 'lumino-js-sdk';
import { given } from '../../utils/assertions';

describe('payments p2p', () => {
    let nodes: Dictionary<LuminoNode>;
    let env: LuminoTestEnvironment;

    // starting deposit for nodes
    const initiatorDeposit = toWei(
        p2p.channels[0].participant1.deposit // should be inferred
    );
    const targetDeposit = toWei(
        p2p.channels[0].participant2.deposit // should be inferred
    );

    // payment amounts to be made
    const initiatorPaymentAmount = toWei(1);
    const targetPaymentAmount = toWei(2);

    beforeEach(async () => {
        env = await setupTestEnvironment(p2p);
        nodes = env.nodes as Dictionary<LuminoNode>;
    }, Timeouts.SETUP);

    afterEach(async () => {
        await env.stop();
    }, Timeouts.TEARDOWN);

    test(
        'initiator node, 1 token',
        async () => {
            const payment: BalanceIdentifier = {
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address,
                amountOnWei: initiatorPaymentAmount
            };
            await nodes.initiator.client.sdk.makePayment(payment);
            // verify initiator -> target
            await given(nodes.initiator)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.target.client.address
                })
                .toHaveBalance(initiatorDeposit - initiatorPaymentAmount);
            // now verify from "target" node
            await given(nodes.target)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.initiator.client.address
                })
                .toHaveBalance(targetDeposit + initiatorPaymentAmount);
        },
        Timeouts.TEST
    );

    test(
        '2 tokens, target node',
        async () => {
            await nodes.initiator.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.target.client.address,
                amountOnWei: initiatorPaymentAmount
            });
            await nodes.target.client.sdk.makePayment({
                tokenAddress: tokenAddresses.LUM,
                partnerAddress: nodes.initiator.client.address,
                amountOnWei: targetPaymentAmount
            });
            await given(nodes.target)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.initiator.client.address
                })
                .toHaveBalance(
                    targetDeposit + initiatorPaymentAmount - targetPaymentAmount
                );
            // repeat verification from "initiator" node
            await given(nodes.initiator)
                .expectChannel({
                    tokenAddress: tokenAddresses.LUM,
                    partnerAddress: nodes.target.client.address
                })
                .toHaveBalance(
                    initiatorDeposit -
                        initiatorPaymentAmount +
                        targetPaymentAmount
                );
        },
        Timeouts.TEST
    );
});
